import { Router, Request, Response } from "express";
import pool from "../db";

const router = Router();

// GET /api/properties — list all available properties with primary image
router.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT
        p.id,
        p.name,
        p.address,
        p.description,
        p.bedrooms,
        p.bathrooms,
        p.max_guests,
        p.price_per_night,
        p.is_available,
        pi.image_url AS primary_image
      FROM properties p
      LEFT JOIN property_images pi
        ON pi.property_id = p.id AND pi.is_primary = true
      WHERE p.is_available = true
      ORDER BY p.id
    `);
    res.json({ data: result.rows });
  } catch (err) {
    console.error("DB error [GET /api/properties]:", err);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

// GET /api/properties/:id — single property with amenities and images
router.get("/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid property id" });

  try {
    const [propResult, amenitiesResult, imagesResult] = await Promise.all([
      pool.query("SELECT * FROM properties WHERE id = $1", [id]),
      pool.query(
        "SELECT name FROM property_amenities WHERE property_id = $1 ORDER BY id",
        [id]
      ),
      pool.query(
        "SELECT image_url, is_primary FROM property_images WHERE property_id = $1 ORDER BY is_primary DESC, id",
        [id]
      ),
    ]);

    if (propResult.rows.length === 0) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.json({
      data: {
        ...propResult.rows[0],
        amenities: amenitiesResult.rows.map((r: any) => r.name),
        images: imagesResult.rows,
      },
    });
  } catch (err) {
    console.error(`DB error [GET /api/properties/${id}]:`, err);
    res.status(500).json({ message: "Failed to fetch property" });
  }
});

// GET /api/properties/:id/images
router.get("/:id/images", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid property id" });

  try {
    const result = await pool.query(
      "SELECT id, image_url, is_primary FROM property_images WHERE property_id = $1 ORDER BY is_primary DESC, id",
      [id]
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error(`DB error [GET /api/properties/${id}/images]:`, err);
    res.status(500).json({ message: "Failed to fetch images" });
  }
});

// GET /api/properties/:id/amenities
router.get("/:id/amenities", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid property id" });

  try {
    const result = await pool.query(
      "SELECT id, name FROM property_amenities WHERE property_id = $1 ORDER BY id",
      [id]
    );
    res.json({ data: result.rows });
  } catch (err) {
    console.error(`DB error [GET /api/properties/${id}/amenities]:`, err);
    res.status(500).json({ message: "Failed to fetch amenities" });
  }
});

// GET /api/properties/:id/events — booked dates for the calendar
router.get("/:id/events", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid property id" });

  try {
    // Events table may not exist yet; return empty array gracefully
    const result = await pool.query(
      `SELECT id, date, is_booked, price
       FROM property_events
       WHERE property_id = $1
       ORDER BY date`,
      [id]
    ).catch(() => ({ rows: [] }));
    res.json({ data: result.rows });
  } catch (err) {
    res.json({ data: [] });
  }
});

export default router;
