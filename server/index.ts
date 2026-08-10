import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import path from "path";
import authRouter from "./routes/auth";
import stripeRouter from "./routes/stripe";

async function createServer() {
  const app = express();

  // Restrict CORS to the known dev/prod origins; do not reflect arbitrary origins
  const allowedOrigins = [
    process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : null,
    process.env.PRODUCTION_URL ?? null,
  ].filter(Boolean) as string[];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Same-origin browser requests have no Origin header — allow them
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      },
      credentials: true,
    })
  );

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
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // API routes
  app.use("/api/auth", authRouter);
  app.use("/api/stripe", stripeRouter);

  if (process.env.NODE_ENV === "production") {
    const distPath = path.resolve("dist");
    app.use(express.static(distPath));
    // Express 5: use app.use() as the SPA catch-all (app.get("*") is invalid in Express 5)
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    // In development, use Vite middleware for HMR and asset serving
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

createServer().catch(console.error);
