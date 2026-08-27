import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { timingSafeEqual } from "crypto";

const router = Router();

function getConfiguredAdminEmail(): string | undefined {
  const configuredEmail = process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL;
  return configuredEmail?.trim().match(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
  )?.[0]?.toLowerCase();
}

// Configure Google OAuth only if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
      },
      (_accessToken, _refreshToken, profile, done) => {
        const user = {
          name: profile.displayName,
          email: profile.emails?.[0]?.value,
          image: profile.photos?.[0]?.value,
          accessToken: _accessToken,
        };
        return done(null, user);
      }
    )
  );

  router.get("/google", (req: Request, res: Response, next: NextFunction) => {
    // Persist redirect target through the OAuth round-trip via the session
    if (typeof req.query.redirect === "string") {
      (req.session as Record<string, unknown>).authRedirect = req.query.redirect;
    }
    passport.authenticate("google", {
      scope: ["openid", "email", "profile"],
    })(req, res, next);
  });

  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/signIn" }),
    (req: Request, res: Response) => {
      const redirect =
        (req.session as Record<string, unknown>).authRedirect as string | undefined;
      delete (req.session as Record<string, unknown>).authRedirect;
      res.redirect(redirect || "/dashboard");
    }
  );
} else {
  // Fallback routes when Google OAuth is not configured
  router.get("/google", (_req: Request, res: Response) => {
    res.status(503).json({ message: "Google OAuth not configured" });
  });
}

// Configure session serialization for both Google and admin-password login.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));

// Admin login for local/admin portal access. The password is read only from
// Replit Secrets / .env and is never returned to the client or logged.
router.post("/admin-login", (req: Request, res: Response, next: NextFunction) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const adminEmail = getConfiguredAdminEmail();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !configuredPassword) {
    res.status(503).json({ message: "Admin login is not configured." });
    return;
  }

  const passwordBuffer = Buffer.from(password);
  const configuredPasswordBuffer = Buffer.from(configuredPassword);
  const passwordMatches =
    passwordBuffer.length === configuredPasswordBuffer.length &&
    timingSafeEqual(passwordBuffer, configuredPasswordBuffer);

  if (email !== adminEmail || !passwordMatches) {
    res.status(401).json({ message: "Invalid admin credentials." });
    return;
  }

  req.login(
    { name: "Admin", email: adminEmail, image: null, isAdmin: true },
    (err) => {
      if (err) {
        next(err);
        return;
      }
      res.json({
        ok: true,
        user: { name: "Admin", email: adminEmail },
        isAdmin: true,
      });
    }
  );
});

router.get("/session", (req: Request, res: Response) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const user = req.user as Record<string, unknown>;
    const adminEmail = getConfiguredAdminEmail();
    res.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      accessToken: user.accessToken,
      isAdmin: !!(adminEmail && String(user.email).toLowerCase() === adminEmail),
    });
  } else {
    res.json(null);
  }
});

router.post("/signout", (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      res.status(500).json({ message: "Error signing out" });
    } else {
      res.json({ message: "Signed out" });
    }
  });
});

export default router;
