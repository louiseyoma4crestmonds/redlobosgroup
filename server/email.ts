import { Resend } from "resend";

interface AdminBookingEmailOptions {
  serviceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  preferredDate: string;
  preferredTime?: string;
  message?: string;
}

export async function sendAdminBookingEmail(opts: AdminBookingEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey || !adminEmail) {
    console.warn(
      "⚠️  Email not configured — booking saved to DB but no email sent. " +
        "Set RESEND_API_KEY and ADMIN_EMAIL secrets to enable notifications."
    );
    return;
  }

  const resend = new Resend(apiKey.trim());

  // Extract a plain email address from whatever format ADMIN_EMAIL is stored in
  // (handles "email@example.com", "<email@example.com>", "Name <email@example.com>", etc.)
  const emailMatch = adminEmail.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
  if (!emailMatch) {
    console.error(
      `❌ ADMIN_EMAIL secret does not contain a valid email address. Current value starts with: ${adminEmail.slice(0, 6)}...`
    );
    return;
  }
  const cleanAdminEmail = emailMatch[0];

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #c9a96e; padding: 24px 32px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px; letter-spacing: 2px;">
          NEW ADD-ON BOOKING
        </h1>
        <p style="color: rgba(255,255,255,0.85); margin: 6px 0 0; font-size: 14px;">
          Red Lobos Group — Add-On Services
        </p>
      </div>

      <div style="background: white; padding: 32px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px; width: 140px;">Service</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-weight: 600; color: #111827;">${opts.serviceName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Customer Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${opts.customerName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">
              <a href="mailto:${opts.customerEmail}" style="color: #c9a96e;">${opts.customerEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Phone</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${opts.customerPhone || "—"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${fmt(opts.preferredDate)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 13px;">Preferred Time</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #111827;">${opts.preferredTime || "—"}</td>
          </tr>
          ${
            opts.message
              ? `
          <tr>
            <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message</td>
            <td style="padding: 10px 0; color: #111827;">${opts.message.replace(/\n/g, "<br>")}</td>
          </tr>`
              : ""
          }
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #fefce8; border-radius: 8px; border: 1px solid #fde68a;">
          <p style="margin: 0; font-size: 13px; color: #92400e;">
            📬 Reply to this email to contact the customer directly at
            <strong> ${opts.customerEmail}</strong>.
          </p>
        </div>
      </div>
    </div>
  `;

  const { data, error } = await resend.emails.send({
    from: "Red Lobos Group <onboarding@resend.dev>",
    to: [cleanAdminEmail],
    replyTo: opts.customerEmail,
    subject: `New Booking: ${opts.serviceName} — ${opts.customerName}`,
    html,
  });

  if (error) {
    throw new Error(`Resend error: ${JSON.stringify(error)}`);
  }

  console.log(`✅ Admin booking email sent via Resend — id: ${data?.id}`);
}
