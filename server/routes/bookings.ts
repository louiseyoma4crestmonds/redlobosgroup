import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// ── GET /api/bookings ────────────────────────────────────────────────────────
// Returns all bookings for the authenticated user, ordered newest first.

router.get("/", async (req: Request, res: Response) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401).json({ message: "Sign in to view your bookings." });
    return;
  }

  const user = req.user as Record<string, unknown>;
  const email = user.email as string;

  try {
    const result = await pool.query(
      `SELECT
         b.id,
         b.property_name,
         b.check_in,
         b.check_out,
         b.guests,
         b.amount_total,
         b.currency,
         b.payment_status,
         b.stripe_session_id,
         b.created_at,
         p.address,
         pi.image_url AS property_image
       FROM bookings b
       LEFT JOIN properties p ON p.id = b.property_id
       LEFT JOIN property_images pi ON pi.property_id = b.property_id AND pi.is_primary = true
       WHERE b.user_email = $1
       ORDER BY b.created_at DESC`,
      [email]
    );
    res.json({ data: result.rows });
  } catch (err: any) {
    console.error("Bookings fetch error:", err.message);
    res.status(500).json({ message: "Could not fetch bookings." });
  }
});

export default router;
