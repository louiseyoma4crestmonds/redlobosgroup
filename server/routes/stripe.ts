import { Router, Request, Response } from "express";
import Stripe from "stripe";
import pool from "../db";

const router = Router();

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

// ── POST /api/stripe/create-checkout-session ────────────────────────────────

router.post("/create-checkout-session", async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
    res.status(503).json({ message: "Stripe is not configured yet." });
    return;
  }

  const { propertyId, propertyName, checkIn, checkOut, guests, totalAmount } =
    req.body;

  if (!propertyId || !checkIn || !checkOut || !guests) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  try {
    // Resolve price: prefer the pre-calculated total sent from the client,
    // otherwise fall back to fetching price_per_night from the database.
    let unitAmountPence: number;

    if (totalAmount && Number(totalAmount) > 0) {
      // Client sends total in pounds — convert to pence
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
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = Math.max(
        1,
        Math.round(
          (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        )
      );
      const subtotal = pricePerNight * nights;
      const serviceFee = Math.round(subtotal * 0.12);
      unitAmountPence = Math.round((subtotal + serviceFee) * 100);
    }

    const host =
      req.headers.origin ||
      `${req.protocol}://${req.get("host")}`;

    const checkInFormatted = new Date(checkIn).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const checkOutFormatted = new Date(checkOut).toLocaleDateString("en-GB", {
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
              description: `${guests} guest${Number(guests) > 1 ? "s" : ""} · ${checkInFormatted} → ${checkOutFormatted}`,
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
// Used by the success page to fetch booking confirmation details.

router.get("/checkout-session", async (req: Request, res: Response) => {
  const stripe = getStripe();
  if (!stripe) {
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
