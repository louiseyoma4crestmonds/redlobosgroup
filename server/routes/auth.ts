import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {
  createHmac,
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "crypto";
import { promisify } from "util";
import pool from "../db";
import { sendPasswordResetEmail } from "../email";

const router = Router();
const scrypt = promisify(scryptCallback);
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

type AuthUser = {
  id?: number;
  name: string;
  email: string;
  image?: string | null;
  isAdmin?: boolean;
  adminUserId?: number;
  ownerAuthVersion?: string;
};

export function normalizeEmail(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

export function validEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function safeTimingEqual(left: Buffer, right: Buffer): boolean {
  return (
    left.length === right.length &&
    timingSafeEqual(left as any, right as any)
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt$${salt}$${derivedKey.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [algorithm, salt, expectedHex] = storedHash.split("$");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;

  const expected = Buffer.from(expectedHex, "hex");
  const actual = (await scrypt(password, salt, expected.length)) as Buffer;
  return safeTimingEqual(actual, expected);
}

function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function getTrustedAppOrigin(): string {
  const configuredOrigin =
    process.env.PRODUCTION_URL ||
    (process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}`
      : undefined);

  if (configuredOrigin) {
    return new URL(configuredOrigin).origin;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("PRODUCTION_URL must be configured for password-reset links.");
  }

  return `http://localhost:${process.env.PORT || 5000}`;
}

function publicUser(user: AuthUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image ?? null,
    isAdmin: false,
  };
}

export async function ensureAuthTables() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT,
      image TEXT,
      auth_provider TEXT NOT NULL DEFAULT 'email',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  await pool.query(
    "CREATE INDEX IF NOT EXISTS password_reset_tokens_user_idx ON password_reset_tokens(user_id)"
  );
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      revoked_at TIMESTAMPTZ
    )
  `);
  await pool.query(`
    ALTER TABLE admin_users
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  `);
}

export function getConfiguredAdminEmail(): string | undefined {
  const configuredEmail = process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL;
  return configuredEmail?.trim().match(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
  )?.[0]?.toLowerCase();
}

function getOwnerCredentialVersion(): string | undefined {
  const adminEmail = getConfiguredAdminEmail();
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET || "dev-secret-change-me";
  if (!adminEmail || !password) return undefined;

  return createHmac("sha256", sessionSecret)
    .update(`${adminEmail}\0${password}`)
    .digest("hex");
}

export function isOwnerSessionUser(user: Record<string, unknown>): boolean {
  const adminEmail = getConfiguredAdminEmail();
  const expectedVersion = getOwnerCredentialVersion();
  const actualVersion =
    typeof user.ownerAuthVersion === "string" ? user.ownerAuthVersion : "";

  return (
    user.isAdmin === true &&
    !user.adminUserId &&
    !!adminEmail &&
    String(user.email).toLowerCase() === adminEmail &&
    !!expectedVersion &&
    safeTimingEqual(Buffer.from(actualVersion), Buffer.from(expectedVersion))
  );
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
      async (_accessToken, _refreshToken, profile, done) => {
        const email = normalizeEmail(profile.emails?.[0]?.value);
        if (!email) {
          done(new Error("Google did not provide an email address."));
          return;
        }

        const user = {
          name: profile.displayName || email.split("@")[0],
          email,
          image: profile.photos?.[0]?.value,
        };

        try {
          const result = await pool.query(
            `INSERT INTO users (name, email, image, auth_provider)
             VALUES ($1, $2, $3, 'google')
             ON CONFLICT (email) DO UPDATE SET
               name = EXCLUDED.name,
               image = COALESCE(EXCLUDED.image, users.image),
               updated_at = NOW()
             RETURNING id, name, email, image`,
            [user.name, email, user.image ?? null]
          );
          done(null, { ...user, id: result.rows[0].id });
        } catch (error) {
          // OAuth should remain usable if the database is temporarily unavailable.
          console.error("Could not persist Google user:", (error as Error).message);
          done(null, user);
        }
      }
    )
  );

  router.get("/google", (req: Request, res: Response, next: NextFunction) => {
    // Persist redirect target through the OAuth round-trip via the session
    if (typeof req.query.redirect === "string") {
      const authSession = req.session as typeof req.session & {
        authRedirect?: string;
      };
      authSession.authRedirect = req.query.redirect;
    }
    passport.authenticate("google", {
      scope: ["openid", "email", "profile"],
    })(req, res, next);
  });

  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/signIn" }),
    (req: Request, res: Response) => {
      const authSession = req.session as typeof req.session & {
        authRedirect?: string;
      };
      const redirect = authSession.authRedirect;
      delete authSession.authRedirect;
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

// ── Customer email/password authentication ──────────────────────────────────

router.post("/register", async (req: Request, res: Response, next: NextFunction) => {
  const name = String(req.body?.name || "").trim();
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (name.length < 2 || name.length > 80) {
    res.status(400).json({ message: "Please enter your full name." });
    return;
  }
  if (!validEmail(email)) {
    res.status(400).json({ message: "Please enter a valid email address." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ message: "Your password must be at least 8 characters." });
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, auth_provider)
       VALUES ($1, $2, $3, 'email')
       RETURNING id, name, email, image`,
      [name, email, passwordHash]
    );
    const user = result.rows[0] as AuthUser;

    req.login(user, (err) => {
      if (err) {
        next(err);
        return;
      }
      res.status(201).json({ ok: true, user: publicUser(user) });
    });
  } catch (error: any) {
    if (error?.code === "23505") {
      res.status(409).json({ message: "An account with that email already exists." });
      return;
    }
    console.error("Registration error:", error?.message || error);
    res.status(500).json({ message: "Could not create your account. Please try again." });
  }
});

router.post("/login", async (req: Request, res: Response, next: NextFunction) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");

  if (!validEmail(email) || !password) {
    res.status(401).json({ message: "Invalid email or password." });
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email, image, password_hash FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0] as
      | (AuthUser & { password_hash?: string | null })
      | undefined;
    const passwordMatches =
      !!user?.password_hash && (await verifyPassword(password, user.password_hash));

    if (!user || !passwordMatches) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    const sessionUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
    req.login(sessionUser, (err) => {
      if (err) {
        next(err);
        return;
      }
      res.json({ ok: true, user: publicUser(sessionUser) });
    });
  } catch (error: any) {
    console.error("Customer login error:", error?.message || error);
    res.status(500).json({ message: "Could not sign you in. Please try again." });
  }
});

router.post("/forgot-password", async (req: Request, res: Response) => {
  const email = normalizeEmail(req.body?.email);
  const genericResponse = {
    message: "If an account exists for that email, we’ve sent password-reset instructions.",
  };

  if (!validEmail(email)) {
    res.json(genericResponse);
    return;
  }

  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE email = $1",
      [email]
    );
    const user = result.rows[0] as
      | { id: number; name: string; email: string }
      | undefined;

    if (user) {
      const token = randomBytes(32).toString("hex");
      await pool.query(
        `UPDATE password_reset_tokens
         SET used_at = NOW()
         WHERE user_id = $1 AND used_at IS NULL`,
        [user.id]
      );
      await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
         VALUES ($1, $2, $3)`,
        [user.id, hashResetToken(token), new Date(Date.now() + RESET_TOKEN_TTL_MS)]
      );

      const origin = getTrustedAppOrigin();
      await sendPasswordResetEmail({
        recipientEmail: user.email,
        recipientName: user.name,
        resetUrl: `${origin}/reset-password?token=${encodeURIComponent(token)}`,
      });
    }
  } catch (error: any) {
    // Always return the same response so callers cannot discover registered emails.
    console.error("Password reset request error:", error?.message || error);
  }

  res.json(genericResponse);
});

router.post("/reset-password", async (req: Request, res: Response) => {
  const token = String(req.body?.token || "");
  const password = String(req.body?.password || "");

  if (!token || password.length < 8) {
    res.status(400).json({
      message: "Please provide a valid reset link and a password of at least 8 characters.",
    });
    return;
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query(
      `SELECT id, user_id
       FROM password_reset_tokens
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > NOW()
       FOR UPDATE`,
      [hashResetToken(token)]
    );
    const resetToken = result.rows[0] as
      | { id: number; user_id: number }
      | undefined;

    if (!resetToken) {
      await client.query("ROLLBACK");
      res.status(400).json({ message: "This reset link is invalid or has expired." });
      return;
    }

    const passwordHash = await hashPassword(password);
    await client.query(
      `UPDATE users
       SET password_hash = $1, auth_provider = 'email', updated_at = NOW()
       WHERE id = $2`,
      [passwordHash, resetToken.user_id]
    );
    await client.query(
      "UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1",
      [resetToken.id]
    );
    await client.query("COMMIT");
    res.json({ ok: true, message: "Your password has been reset. You can now sign in." });
  } catch (error: any) {
    await client.query("ROLLBACK").catch(() => {});
    console.error("Password reset error:", error?.message || error);
    res.status(500).json({ message: "Could not reset your password. Please try again." });
  } finally {
    client.release();
  }
});

// The environment-backed owner and database-backed admin accounts share the
// same session shape, but only the owner can manage admin accounts.
router.post("/admin-login", (req: Request, res: Response, next: NextFunction) => {
  const email = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const adminEmail = getConfiguredAdminEmail();
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (
    adminEmail &&
    configuredPassword &&
    email === adminEmail &&
    safeTimingEqual(Buffer.from(password), Buffer.from(configuredPassword))
  ) {
    const ownerAuthVersion = getOwnerCredentialVersion();
    req.login(
      {
        name: "Admin",
        email: adminEmail,
        image: null,
        isAdmin: true,
        ownerAuthVersion,
      },
      (err) => {
        if (err) {
          next(err);
          return;
        }
        res.json({
          ok: true,
          user: { name: "Admin", email: adminEmail },
          isAdmin: true,
          isOwner: true,
        });
      }
    );
    return;
  }

  pool
    .query(
      "SELECT id, email, password_hash FROM admin_users WHERE email = $1 AND is_active = TRUE",
      [email]
    )
    .then(async (result) => {
      const account = result.rows[0] as
        | { id: number; email: string; password_hash: string }
        | undefined;
      const passwordMatches =
        !!account && (await verifyPassword(password, account.password_hash));

      if (!account || !passwordMatches) {
        if (!adminEmail || !configuredPassword) {
          res.status(503).json({ message: "Admin login is not configured." });
        } else {
          res.status(401).json({ message: "Invalid admin credentials." });
        }
        return;
      }

      req.login(
        {
          name: "Admin",
          email: account.email,
          image: null,
          isAdmin: true,
          adminUserId: account.id,
        },
        (err) => {
          if (err) {
            next(err);
            return;
          }
          res.json({
            ok: true,
            user: { name: "Admin", email: account.email },
            isAdmin: true,
            isOwner: false,
          });
        }
      );
    })
    .catch((error) => {
      console.error("Admin account login error:", error?.message || error);
      res.status(500).json({ message: "Could not sign you in. Please try again." });
    });
});

function invalidateAuthSession(req: Request, res: Response) {
  req.session.destroy(() => {
    res.clearCookie("connect.sid", { path: "/" });
    res.status(401).json(null);
  });
}

router.get("/session", async (req: Request, res: Response) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    const user = req.user as Record<string, unknown>;
    let isActiveAdmin = user.isAdmin === true;

    if (user.adminUserId) {
      try {
        const result = await pool.query(
          "SELECT 1 FROM admin_users WHERE id = $1 AND is_active = TRUE",
          [user.adminUserId]
        );
        isActiveAdmin = result.rowCount === 1;
        if (!isActiveAdmin) {
          invalidateAuthSession(req, res);
          return;
        }
      } catch (error: any) {
        console.error("Admin session validation error:", error?.message || error);
        res.status(500).json({ message: "Could not validate your session." });
        return;
      }
    } else if (user.isAdmin === true && !isOwnerSessionUser(user)) {
      invalidateAuthSession(req, res);
      return;
    }

    const isOwner = isOwnerSessionUser(user);

    res.json({
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
      },
      isAdmin: isActiveAdmin,
      isOwner,
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
