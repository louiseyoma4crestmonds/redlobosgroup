import { Router, Request, Response } from "express";
import Stripe from "stripe";

const router = Router();

const PROPERTY_PRICING: { [key: string]: number } = {
  "1": 500,
  "2": 450,
  "3": 600,
};

router.post(
  "/create-checkout-session",
  async (req: Request, res: Response) => {
    if (!process.env.STRIPE_SECRET_KEY) {
      res.status(500).json({ message: "Stripe not configured" });
      return;
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    try {
      const { propertyId, propertyName, checkIn, checkOut, guests } = req.body;

      if (!propertyId || !checkIn || !checkOut || !guests) {
        res.status(400).json({ message: "Missing required fields" });
        return;
      }

      const amount = PROPERTY_PRICING[propertyId.toString()] || 500;
      const host =
        req.headers.origin || `${req.protocol}://${req.headers.host}`;

      const sessionObj = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: propertyName || "Property Reservation",
                description: `${guests} guest${Number(guests) > 1 ? "s" : ""} • ${checkIn} to ${checkOut}`,
              },
              unit_amount: Math.round(amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${host}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${host}/payment/cancel`,
        metadata: { propertyId, checkIn, checkOut, guests },
      });

      res.status(200).json({ sessionId: sessionObj.id, url: sessionObj.url });
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Stripe checkout error:", err);
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  }
);

export default router;
