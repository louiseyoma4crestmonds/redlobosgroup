import "dotenv/config";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import cors from "cors";
import passport from "passport";
import path from "path";
import { readFile } from "fs/promises";
import { runMigrations } from "stripe-replit-sync";
import authRouter, { ensureAuthTables } from "./routes/auth";
import stripeRouter from "./routes/stripe";
import propertiesRouter from "./routes/properties";
import bookingsRouter from "./routes/bookings";
import addonBookingsRouter from "./routes/addonBookings";
import adminRouter from "./routes/admin";
import contactRouter from "./routes/contact";
import { WebhookHandlers } from "./webhookHandlers";
import { getStripeSync } from "./stripeClient";
import pool from "./db";
import {
  getPublicOrigin,
  isKnownAppPath,
  renderSeoHead,
  renderSeoNoscript,
  renderSitemap,
} from "./seo";

const PgSession = connectPgSimple(session);

function parseTrustProxy(): number {
  const configured = process.env.TRUST_PROXY?.trim().toLowerCase();
  if (!configured) return process.env.NODE_ENV === "production" ? 1 : 0;
  if (configured === "true") return 1;
  if (configured === "false") return 0;

  const proxyCount = Number(configured);
  if (!Number.isInteger(proxyCount) || proxyCount < 0) {
    throw new Error(
      "TRUST_PROXY must be true, false, or a non-negative integer."
    );
  }
  return proxyCount;
}

function normalizeOrigin(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return value.replace(/\/+$/, "");
  }
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.warn("⚠️  DATABASE_URL not set — skipping Stripe init");
    return;
  }
  try {
    console.log("Initializing Stripe schema...");
    await runMigrations({ databaseUrl });
    console.log("✅ Stripe schema ready");

    const stripeSync = await getStripeSync();
    const webhookBaseUrl = `https://${
      process.env.REPLIT_DOMAINS?.split(",")[0]
    }`;
    await stripeSync.findOrCreateManagedWebhook(
      `${webhookBaseUrl}/api/stripe/webhook`
    );
    console.log("✅ Stripe webhook configured");

    // Backfill runs in background — don't block server startup
    stripeSync
      .syncBackfill()
      .then(() => console.log("✅ Stripe backfill complete"))
      .catch((err: Error) =>
        console.error("Stripe backfill error:", err.message)
      );
  } catch (err: any) {
    console.error(
      "⚠️  Stripe init failed (payments will be unavailable):",
      err.message
    );
  }
}

async function createServer() {
  const app = express();

  if (process.env.NODE_ENV === "production" && !process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET must be configured in production.");
  }

  try {
    await ensureAuthTables();
    console.log("✅ Authentication tables ready");
  } catch (err: any) {
    console.error("⚠️  Authentication table setup failed:", err.message);
  }

  // Replit and Nginx terminate HTTPS before forwarding requests to Express.
  // Set TRUST_PROXY=false when Node is directly exposed without a proxy.
  const trustProxy = parseTrustProxy();
  app.set("trust proxy", trustProxy);

  // ── 1. Stripe webhook — must be BEFORE express.json() ─────────────────────
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const signature = req.headers["stripe-signature"];
      if (!signature) {
        res.status(400).json({ error: "Missing stripe-signature" });
        return;
      }
      try {
        const sig = Array.isArray(signature) ? signature[0] : signature;
        await WebhookHandlers.processWebhook(req.body as Buffer, sig);
        res.status(200).json({ received: true });
      } catch (err: any) {
        console.error("Webhook error:", err.message);
        res.status(400).json({ error: "Webhook processing error" });
      }
    }
  );

  // ── 2. CORS ────────────────────────────────────────────────────────────────
  const allowedOrigins = [
    normalizeOrigin(
      process.env.REPLIT_DEV_DOMAIN
        ? `https://${process.env.REPLIT_DEV_DOMAIN}`
        : null
    ),
    normalizeOrigin(process.env.PRODUCTION_URL),
    "http://localhost:5000",
    "http://127.0.0.1:5000",
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      },
      credentials: true,
    })
  );

  // ── 3. Body parsing & session ──────────────────────────────────────────────
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  const sessionCookieSecure =
    process.env.SESSION_COOKIE_SECURE !== undefined
      ? process.env.SESSION_COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
  const sessionStore = process.env.DATABASE_URL
    ? new PgSession({
        pool,
        tableName: "user_sessions",
        createTableIfMissing: true,
      })
    : undefined;
  console.log(
    `Session configuration: store=${
      sessionStore ? "postgres" : "memory"
    }, secureCookie=${sessionCookieSecure}, trustProxy=${trustProxy}`
  );

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: {
        secure: sessionCookieSecure,
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // ── 4. API routes ──────────────────────────────────────────────────────────
  app.use("/api/auth", authRouter);
  app.use("/api/stripe", stripeRouter);
  app.use("/api/properties", propertiesRouter);
  app.use("/api/bookings", bookingsRouter);
  app.use("/api/addon-bookings", addonBookingsRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/contact", contactRouter);

  // ── 5. Crawlability ────────────────────────────────────────────────────────
  app.get("/robots.txt", (req, res) => {
    const origin = getPublicOrigin(req);
    res
      .type("text/plain")
      .send(
        [
          "User-agent: *",
          "Allow: /",
          "Disallow: /admin",
          "Disallow: /dashboard",
          "Disallow: /signIn",
          "Disallow: /reset-password",
          "Disallow: /checkout",
          "Disallow: /payment/",
          "Disallow: /api/",
          `Sitemap: ${origin}/sitemap.xml`,
          "",
        ].join("\n")
      );
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT id FROM properties WHERE is_available = true ORDER BY id"
      );
      res.type("application/xml").send(
        renderSitemap(
          getPublicOrigin(req),
          result.rows.map((row: { id: number }) => Number(row.id))
        )
      );
    } catch (err) {
      console.error("Sitemap generation error:", err);
      res.type("application/xml").send(renderSitemap(getPublicOrigin(req), []));
    }
  });

  // ── 6. Static / Vite ───────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve("dist");
    app.use(
      express.static(distPath, {
        index: false,
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader(
              "Cache-Control",
              "public, max-age=31536000, immutable"
            );
          }
        },
      })
    );
    app.use(async (req, res, next) => {
      try {
        const html = await readFile(path.join(distPath, "index.html"), "utf8");
        const pathname = req.path;
        const search = req.originalUrl.includes("?")
          ? req.originalUrl.slice(req.originalUrl.indexOf("?"))
          : "";
        const seoHtml = html
          .replace(
            /<!-- SEO_HEAD_START -->[\s\S]*?<!-- SEO_HEAD_END -->/,
            `<!-- SEO_HEAD_START -->${renderSeoHead(
              req,
              pathname,
              search
            )}<!-- SEO_HEAD_END -->`
          )
          .replace(
            /<!-- SEO_NOSCRIPT -->/,
            `<noscript id="seo-noscript">${renderSeoNoscript(
              pathname
            )}</noscript>`
          );
        if (!isKnownAppPath(pathname)) {
          res.status(404);
        }
        res.setHeader("Cache-Control", "no-cache");
        res.send(seoHtml);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  const PORT = process.env.PORT || 5000;
  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  });
}

// Initialise Stripe (non-blocking on failure) then start the HTTP server
initStripe().finally(() => createServer().catch(console.error));
