import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PROPERTY_PRICING: { [key: string]: number } = {
  "1": 500,
  "2": 450,
  "3": 600,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { propertyId, propertyName, checkIn, checkOut, guests } = req.body;

    if (!propertyId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const amount = PROPERTY_PRICING[propertyId.toString()] || 500;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: propertyName || "Property Reservation",
              description: `${guests} guest${guests > 1 ? 's' : ''} • ${checkIn} to ${checkOut}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/payment/cancel`,
      metadata: {
        propertyId,
        checkIn,
        checkOut,
        guests,
      },
    });

    res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
}
