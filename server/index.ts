import dotenv from "dotenv";
dotenv.config();
import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import path from "path";
import { runMigrations } from "stripe-replit-sync";
import authRouter from "./routes/auth";
import stripeRouter from "./routes/stripe";
import propertiesRouter from "./routes/properties";
import bookingsRouter from "./routes/bookings";
import addonBookingsRouter from "./routes/addonBookings";
import adminRouter from "./routes/admin";
import contactRouter from "./routes/contact";
import { WebhookHandlers } from "./webhookHandlers";
import { getStripeSync } from "./stripeClient";

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;
  console.warn("hello miss: ", databaseUrl);
  if (!databaseUrl) {
    console.warn("⚠️  DATABASE_URL not set — skipping Stripe init");
    return;
  }
  console.warn("hello miss: ", databaseUrl);
  try {
    console.log("Initializing Stripe schema...");
    await runMigrations({ databaseUrl, schema: "stripe" });
    console.log("✅ Stripe schema ready");

    const stripeSync = await getStripeSync();
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(",")[0]}`;
    await stripeSync.findOrCreateManagedWebhook(`${webhookBaseUrl}/api/stripe/webhook`);
    console.log("✅ Stripe webhook configured");

    // Backfill runs in background — don't block server startup
    stripeSync.syncBackfill()
      .then(() => console.log("✅ Stripe backfill complete"))
      .catch((err: Error) => console.error("Stripe backfill error:", err.message));
  } catch (err: any) {
    console.error("⚠️  Stripe init failed (payments will be unavailable):", err.message);
  }
}

async function createServer() {
  const app = express();

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
    process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
    process.env.PRODUCTION_URL ?? null,
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

  app.use(
    session({
      secret: process.env.SESSION_SECRET || "dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
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

  // ── 5. Static / Vite ───────────────────────────────────────────────────────
  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve("dist");
    app.use(express.static(distPath));
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    const { createServer: createViteServer } = await import("vite");
    const vite:any = await createViteServer({
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
