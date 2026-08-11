import { Router, Request, Response } from "express";
import pool from "../db";
import { sendAdminBookingEmail } from "../email";

const router = Router();

// POST /api/addon-bookings
router.post("/", async (req: Request, res: Response) => {
  const {
    serviceId,
    serviceName,
    customerName,
    customerEmail,
    customerPhone,
    preferredDate,
    preferredTime,
    message,
  } = req.body;

  if (!serviceId || !serviceName || !customerName || !customerEmail || !preferredDate) {
    res.status(400).json({ message: "Name, email and preferred date are required." });
    return;
  }

  // Basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    res.status(400).json({ message: "Please enter a valid email address." });
    return;
  }

  try {
    // Persist to DB
    await pool.query(
      `INSERT INTO addon_bookings
         (service_id, service_name, customer_name, customer_email, customer_phone,
          preferred_date, preferred_time, message)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        serviceId,
        serviceName,
        customerName,
        customerEmail,
        customerPhone || null,
        preferredDate,
        preferredTime || null,
        message || null,
      ]
    );

    // Fire-and-forget email — don't fail the request if email fails
    sendAdminBookingEmail({
      serviceName,
      customerName,
      customerEmail,
      customerPhone,
      preferredDate,
      preferredTime,
      message,
    }).catch((err: Error) =>
      console.error("Admin email send failed:", err.message)
    );

    res.status(201).json({ message: "Booking received! We will be in touch shortly." });
  } catch (err: any) {
    console.error("Addon booking error:", err.message);
    res.status(500).json({ message: "Could not save your booking. Please try again." });
  }
});

export default router;
