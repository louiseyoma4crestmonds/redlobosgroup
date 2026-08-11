import { getStripeSync } from './stripeClient';
import pool from './db';

async function upsertBookingFromSession(session: {
  id: string;
  metadata?: Record<string, string> | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string | null;
}) {
  const meta = session.metadata;
  if (!meta?.userEmail || !meta?.checkIn || !meta?.checkOut) return;

  await pool.query(
    `INSERT INTO bookings
       (user_email, property_id, property_name, check_in, check_out, guests,
        amount_total, currency, stripe_session_id, payment_status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     ON CONFLICT (stripe_session_id) DO UPDATE
       SET payment_status = EXCLUDED.payment_status`,
    [
      meta.userEmail,
      meta.propertyId ? parseInt(meta.propertyId, 10) : null,
      meta.propertyName ?? null,
      meta.checkIn,
      meta.checkOut,
      meta.guests ? parseInt(meta.guests, 10) : 1,
      session.amount_total ?? null,
      session.currency ?? 'gbp',
      session.id,
      session.payment_status ?? 'paid',
    ]
  );
}

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    const event = await sync.processWebhook(payload, signature);

    // Store confirmed bookings in our own DB
    if (event && (event as any).type === 'checkout.session.completed') {
      const session = (event as any).data?.object;
      if (session) {
        await upsertBookingFromSession(session).catch((err: Error) =>
          console.error('Failed to store booking from webhook:', err.message)
        );
      }
    }
  }
}

// Export upsert so the success endpoint can also call it (dev fallback)
export { upsertBookingFromSession };
