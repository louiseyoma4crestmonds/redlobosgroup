import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

const router = Router();

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

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user: Express.User, done) => done(null, user));

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

router.get("/session", (req: Request, res: Response) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const user = req.user as Record<string, unknown>;
    res.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      accessToken: user.accessToken,
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
