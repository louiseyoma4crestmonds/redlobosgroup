---
name: Database schema
description: Tables created in the Replit PostgreSQL database for the Red Lobos Group property booking app.
---

# Red Lobos Group — DB Schema

**Why:** Properties are served from the Replit PostgreSQL DB, not the external API (which was returning 502 and had browser CORS restrictions).

## Tables

### `properties`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| name | TEXT | |
| address | TEXT | |
| description | TEXT | |
| bedrooms | INTEGER | default 1 |
| bathrooms | INTEGER | default 1 |
| max_guests | INTEGER | default 2 |
| price_per_night | NUMERIC(10,2) | |
| is_available | BOOLEAN | default true |
| created_at | TIMESTAMPTZ | |

### `property_images`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| property_id | INTEGER FK → properties | |
| image_url | TEXT | relative path e.g. `/property1.jpg` |
| is_primary | BOOLEAN | primary image shown in card |
| created_at | TIMESTAMPTZ | |

### `property_amenities`
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| property_id | INTEGER FK → properties | |
| name | TEXT | e.g. "Free Wi-Fi" |

### `property_events` (referenced but not yet created)
Would hold booked dates per property for the calendar. Routes return `[]` gracefully if table absent.

## How to apply
- Add properties: `INSERT INTO properties (name, address, ...) VALUES (...)`
- Add images: `INSERT INTO property_images (property_id, image_url, is_primary) VALUES (...)`
- Add amenities: `INSERT INTO property_amenities (property_id, name) VALUES (...)`

**How to apply:** Any new property data goes through these tables. The `/api/properties` Express routes (server/routes/properties.ts) query them; no external API involved.
