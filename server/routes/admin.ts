import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";
import {
  getConfiguredAdminEmail,
  hashPassword,
  isOwnerSessionUser,
  normalizeEmail,
  validEmail,
} from "./auth";

const router = Router();

// ── Admin guard middleware ────────────────────────────────────────────────────
async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  const user = req.user as Record<string, unknown>;
  if (user.isAdmin !== true) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  if (user.adminUserId) {
    try {
      const result = await pool.query(
        "SELECT 1 FROM admin_users WHERE id = $1 AND is_active = TRUE",
        [user.adminUserId]
      );
      if (result.rowCount !== 1) {
        req.session.destroy(() => {
          res.clearCookie("connect.sid", { path: "/" });
          res.status(401).json({ message: "Admin access has been revoked." });
        });
        return;
      }
    } catch (error) {
      console.error("Admin authorization check:", error);
      res.status(500).json({ message: "Could not validate admin access." });
      return;
    }
  } else if (!isOwnerSessionUser(user)) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
}

router.use(requireAdmin);

async function requireOwner(req: Request, res: Response, next: NextFunction) {
  const user = req.user as Record<string, unknown>;
  if (!isOwnerSessionUser(user)) {
    res.status(403).json({ message: "Owner access required." });
    return;
  }
  next();
}

router.get("/accounts", requireOwner, async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT id, email, is_active, created_at, revoked_at
      FROM admin_users
      ORDER BY created_at DESC
    `);
    res.json({ data: result.rows });
  } catch (error) {
    console.error("Admin GET /accounts:", error);
    res.status(500).json({ message: "Could not load admin accounts." });
  }
});

router.post("/accounts", requireOwner, async (req: Request, res: Response) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || "");
  const ownerEmail = getConfiguredAdminEmail();

  if (!validEmail(email)) {
    res.status(400).json({ message: "Please enter a valid admin email." });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ message: "Admin passwords must be at least 8 characters." });
    return;
  }
  if (email === ownerEmail) {
    res.status(409).json({ message: "The owner account is already configured." });
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO admin_users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, is_active, created_at, revoked_at`,
      [email, passwordHash]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (error: any) {
    if (error?.code === "23505") {
      res.status(409).json({ message: "An admin account with that email already exists." });
      return;
    }
    console.error("Admin POST /accounts:", error);
    res.status(500).json({ message: "Could not create the admin account." });
  }
});

router.post(
  "/accounts/:id/revoke",
  requireOwner,
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({ message: "Invalid admin account." });
      return;
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query(
        `UPDATE admin_users
         SET is_active = FALSE, revoked_at = NOW(), updated_at = NOW()
         WHERE id = $1 AND is_active = TRUE
         RETURNING id, email, is_active, created_at, revoked_at`,
        [id]
      );
      if (result.rowCount !== 1) {
        await client.query("ROLLBACK");
        res.status(404).json({ message: "Active admin account not found." });
        return;
      }
      await client.query(
        `DELETE FROM user_sessions
         WHERE sess -> 'passport' -> 'user' ->> 'adminUserId' = $1`,
        [String(id)]
      );
      await client.query("COMMIT");
      res.json({ data: result.rows[0] });
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      console.error("Admin POST /accounts/:id/revoke:", error);
      res.status(500).json({ message: "Could not revoke the admin account." });
    } finally {
      client.release();
    }
  }
);

type BookingDateRange = {
  check_in: string | Date;
  check_out: string | Date;
};

const confirmedPaymentStatuses = new Set([
  "paid",
  "succeeded",
  "complete",
  "completed",
]);

function toUtcDate(value: string | Date): Date {
  const dateText = String(value).slice(0, 10);
  const [year, month, day] = dateText.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function addDays(value: Date, days: number): Date {
  const result = new Date(value);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function nextAvailableDate(bookings: BookingDateRange[]): string {
  let availableFrom = toUtcDate(new Date());

  const sortedBookings = [...bookings].sort(
    (a, b) => toUtcDate(a.check_in).getTime() - toUtcDate(b.check_in).getTime()
  );

  for (const booking of sortedBookings) {
    const checkIn = toUtcDate(booking.check_in);
    const checkOut = toUtcDate(booking.check_out);

    if (checkOut < availableFrom) continue;
    if (checkIn > availableFrom) break;

    // Checkout day remains blocked; a new stay can begin the following day.
    const bookingAvailableFrom = addDays(checkOut, 1);
    if (bookingAvailableFrom > availableFrom) {
      availableFrom = bookingAvailableFrom;
    }
  }

  return toDateKey(availableFrom);
}

// ── Properties ────────────────────────────────────────────────────────────────

// GET /api/admin/properties — all properties (including unavailable) + primary image
router.get("/properties", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id, p.name, p.address, p.description,
        p.bedrooms, p.bathrooms, p.max_guests,
        p.price_per_night, p.is_available,
        pi.image_url AS primary_image
      FROM properties p
      LEFT JOIN property_images pi
        ON pi.property_id = p.id AND pi.is_primary = true
      ORDER BY p.id
    `);
    res.json({ data: result.rows });
  } catch (err) {
    console.error("Admin GET /properties:", err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

// GET /api/admin/bookings — paid reservations with property availability
router.get("/bookings", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        b.id,
        b.user_email,
        b.property_id,
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
      LEFT JOIN property_images pi
        ON pi.property_id = b.property_id AND pi.is_primary = true
      ORDER BY b.check_in ASC, b.created_at DESC
    `);

    const bookingsByProperty = new Map<string, BookingDateRange[]>();
    for (const booking of result.rows) {
      const status = String(booking.payment_status ?? "").toLowerCase();
      if (!confirmedPaymentStatuses.has(status)) continue;

      const propertyKey = String(booking.property_id ?? booking.property_name ?? booking.id);
      const propertyBookings = bookingsByProperty.get(propertyKey) ?? [];
      propertyBookings.push(booking);
      bookingsByProperty.set(propertyKey, propertyBookings);
    }

    const data = result.rows.map((booking) => {
      const propertyKey = String(booking.property_id ?? booking.property_name ?? booking.id);
      return {
        ...booking,
        amount_total:
          booking.amount_total == null ? null : Number(booking.amount_total),
        next_available_date: nextAvailableDate(
          bookingsByProperty.get(propertyKey) ?? []
        ),
      };
    });

    res.json({ data });
  } catch (err) {
    console.error("Admin GET /bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// GET /api/admin/properties/:id — single property with amenities + images
router.get("/properties/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    const [prop, amenities, images] = await Promise.all([
      pool.query("SELECT * FROM properties WHERE id = $1", [id]),
      pool.query(
        "SELECT id, name FROM property_amenities WHERE property_id = $1 ORDER BY id",
        [id]
      ),
      pool.query(
        "SELECT id, image_url, is_primary FROM property_images WHERE property_id = $1 ORDER BY is_primary DESC, id",
        [id]
      ),
    ]);
    if (prop.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({
      data: {
        ...prop.rows[0],
        amenities: amenities.rows,
        images: images.rows,
      },
    });
  } catch (err) {
    console.error("Admin GET /properties/:id:", err);
    res.status(500).json({ message: "Failed to fetch property" });
  }
});

// POST /api/admin/properties — create property
router.post("/properties", async (req: Request, res: Response) => {
  const { name, address, description, bedrooms, bathrooms, max_guests, price_per_night, is_available } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  try {
    const result = await pool.query(
      `INSERT INTO properties (name, address, description, bedrooms, bathrooms, max_guests, price_per_night, is_available)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, address || "", description || "", bedrooms || 0, bathrooms || 0, max_guests || 1, price_per_night || 0, is_available ?? true]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error("Admin POST /properties:", err);
    res.status(500).json({ message: "Failed to create property" });
  }
});

// PUT /api/admin/properties/:id — update property details
router.put("/properties/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  const { name, address, description, bedrooms, bathrooms, max_guests, price_per_night, is_available } = req.body;

  try {
    const result = await pool.query(
      `UPDATE properties SET
        name = $1, address = $2, description = $3,
        bedrooms = $4, bathrooms = $5, max_guests = $6,
        price_per_night = $7, is_available = $8
       WHERE id = $9 RETURNING *`,
      [name, address, description, bedrooms, bathrooms, max_guests, price_per_night, is_available, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error("Admin PUT /properties/:id:", err);
    res.status(500).json({ message: "Failed to update property" });
  }
});

// DELETE /api/admin/properties/:id — delete property and all related data
router.delete("/properties/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });

  try {
    await pool.query("DELETE FROM property_amenities WHERE property_id = $1", [id]);
    await pool.query("DELETE FROM property_images WHERE property_id = $1", [id]);
    await pool.query("DELETE FROM property_events WHERE property_id = $1", [id]).catch(() => {});
    const result = await pool.query("DELETE FROM properties WHERE id = $1 RETURNING id", [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Property deleted" });
  } catch (err) {
    console.error("Admin DELETE /properties/:id:", err);
    res.status(500).json({ message: "Failed to delete property" });
  }
});

// ── Amenities ─────────────────────────────────────────────────────────────────

// POST /api/admin/properties/:id/amenities
router.post("/properties/:id/amenities", async (req: Request, res: Response) => {
  const propertyId = parseInt(req.params.id, 10);
  const { name } = req.body;
  if (isNaN(propertyId) || !name) return res.status(400).json({ message: "Property id and name required" });

  try {
    const result = await pool.query(
      "INSERT INTO property_amenities (property_id, name) VALUES ($1, $2) RETURNING id, name",
      [propertyId, name]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error("Admin POST amenity:", err);
    res.status(500).json({ message: "Failed to add amenity" });
  }
});

// PUT /api/admin/properties/:id/amenities/:amenityId
router.put("/properties/:id/amenities/:amenityId", async (req: Request, res: Response) => {
  const amenityId = parseInt(req.params.amenityId, 10);
  const { name } = req.body;
  if (isNaN(amenityId) || !name) return res.status(400).json({ message: "Amenity id and name required" });

  try {
    const result = await pool.query(
      "UPDATE property_amenities SET name = $1 WHERE id = $2 RETURNING id, name",
      [name, amenityId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Amenity not found" });
    res.json({ data: result.rows[0] });
  } catch (err) {
    console.error("Admin PUT amenity:", err);
    res.status(500).json({ message: "Failed to update amenity" });
  }
});

// DELETE /api/admin/properties/:id/amenities/:amenityId
router.delete("/properties/:id/amenities/:amenityId", async (req: Request, res: Response) => {
  const amenityId = parseInt(req.params.amenityId, 10);
  if (isNaN(amenityId)) return res.status(400).json({ message: "Invalid amenity id" });

  try {
    await pool.query("DELETE FROM property_amenities WHERE id = $1", [amenityId]);
    res.json({ message: "Amenity deleted" });
  } catch (err) {
    console.error("Admin DELETE amenity:", err);
    res.status(500).json({ message: "Failed to delete amenity" });
  }
});

// ── Images ────────────────────────────────────────────────────────────────────

// POST /api/admin/properties/:id/images
router.post("/properties/:id/images", async (req: Request, res: Response) => {
  const propertyId = parseInt(req.params.id, 10);
  const { image_url, is_primary } = req.body;
  if (isNaN(propertyId) || !image_url) return res.status(400).json({ message: "Property id and image_url required" });

  try {
    if (is_primary) {
      await pool.query("UPDATE property_images SET is_primary = false WHERE property_id = $1", [propertyId]);
    }
    const result = await pool.query(
      "INSERT INTO property_images (property_id, image_url, is_primary) VALUES ($1,$2,$3) RETURNING id, image_url, is_primary",
      [propertyId, image_url, is_primary ?? false]
    );
    res.status(201).json({ data: result.rows[0] });
  } catch (err) {
    console.error("Admin POST image:", err);
    res.status(500).json({ message: "Failed to add image" });
  }
});

// PUT /api/admin/properties/:id/images/:imageId — set as primary
router.put("/properties/:id/images/:imageId", async (req: Request, res: Response) => {
  const propertyId = parseInt(req.params.id, 10);
  const imageId = parseInt(req.params.imageId, 10);
  if (isNaN(propertyId) || isNaN(imageId)) return res.status(400).json({ message: "Invalid id" });

  try {
    await pool.query("UPDATE property_images SET is_primary = false WHERE property_id = $1", [propertyId]);
    await pool.query("UPDATE property_images SET is_primary = true WHERE id = $1", [imageId]);
    res.json({ message: "Primary image updated" });
  } catch (err) {
    console.error("Admin PUT image:", err);
    res.status(500).json({ message: "Failed to update image" });
  }
});

// DELETE /api/admin/properties/:id/images/:imageId
router.delete("/properties/:id/images/:imageId", async (req: Request, res: Response) => {
  const imageId = parseInt(req.params.imageId, 10);
  if (isNaN(imageId)) return res.status(400).json({ message: "Invalid image id" });

  try {
    await pool.query("DELETE FROM property_images WHERE id = $1", [imageId]);
    res.json({ message: "Image deleted" });
  } catch (err) {
    console.error("Admin DELETE image:", err);
    res.status(500).json({ message: "Failed to delete image" });
  }
});

export default router;
