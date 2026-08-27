import { Router, Request, Response, NextFunction } from "express";
import pool from "../db";

const router = Router();

// ── Admin guard middleware ────────────────────────────────────────────────────
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }
  const user = req.user as Record<string, unknown>;
  const configuredEmail = process.env.ADMIN_LOGIN_EMAIL || process.env.ADMIN_EMAIL;
  const adminEmail = configuredEmail?.trim().match(
    /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/
  )?.[0]?.toLowerCase();
  if (
    user.isAdmin !== true ||
    !adminEmail ||
    String(user.email).toLowerCase() !== adminEmail
  ) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }
  next();
}

router.use(requireAdmin);

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
