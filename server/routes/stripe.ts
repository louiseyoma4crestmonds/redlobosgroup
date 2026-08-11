import { Router, Request, Response } from "express";
import { getUncachableStripeClient } from "../stripeClient";
import pool from "../db";

const router = Router();

// ── POST /api/stripe/create-checkout-session ────────────────────────────────

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  let stripe: import("stripe").default;
  try {
    stripe = await getUncachableStripeClient();
  } catch {
    res.status(503).json({ message: "Stripe is not configured. Please connect Stripe via the Integrations tab." });
    return;
  }

  const { propertyId, propertyName, checkIn, checkOut, guests, totalAmount } = req.body;

  if (!propertyId || !checkIn || !checkOut || !guests) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    // Resolve amount: prefer pre-calculated total from client, else compute from DB
    let unitAmountPence: number;

    if (totalAmount && Number(totalAmount) > 0) {
      unitAmountPence = Math.round(Number(totalAmount) * 100);
    } else {
      const result = await pool.query(
        "SELECT price_per_night FROM properties WHERE id = $1",
        [parseInt(propertyId, 10)]
      );
      if (result.rows.length === 0) {
        res.status(404).json({ message: "Property not found." });
        return;
      }
      const pricePerNight = parseFloat(result.rows[0].price_per_night);
      const nights = Math.max(
        1,
        Math.round(
          (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      );
      const subtotal = pricePerNight * nights;
      unitAmountPence = Math.round((subtotal + Math.round(subtotal * 0.12)) * 100);
    }

    const host = req.headers.origin || `${req.protocol}://${req.get("host")}`;

    const fmt = (d: string) =>
      new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: propertyName || "Property Reservation",
              description: `${guests} guest${Number(guests) > 1 ? "s" : ""} · ${fmt(checkIn)} → ${fmt(checkOut)}`,
            },
            unit_amount: unitAmountPence,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${host}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${host}/payment/cancel`,
      metadata: {
        propertyId: String(propertyId),
        propertyName: propertyName || "Property Reservation",
        checkIn,
        checkOut,
        guests: String(guests),
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Stripe checkout error:", err.message);
    res.status(500).json({ message: err.message || "Checkout failed." });
  }
});

// ── GET /api/stripe/checkout-session ────────────────────────────────────────
// Used by the success page to display booking confirmation details.

router.get("/checkout-session", async (req: Request, res: Response) => {
  let stripe: import("stripe").default;
  try {
    stripe = await getUncachableStripeClient();
  } catch {
    res.status(503).json({ message: "Stripe is not configured." });
    return;
  }

  const sessionId = req.query.session_id as string;
  if (!sessionId) {
    res.status(400).json({ message: "Missing session_id." });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.json({
      metadata: session.metadata,
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      customer_email: session.customer_details?.email ?? null,
    });
  } catch (err: any) {
    console.error("Stripe session fetch error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

export default router;
