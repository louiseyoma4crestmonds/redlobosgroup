CREATE TABLE IF NOT EXISTS addon_bookings (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL,
  service_name TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS addon_bookings_preferred_date_idx
  ON addon_bookings(preferred_date);

WITH ranked_sessions AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY stripe_session_id
      ORDER BY id
    ) AS duplicate_number
  FROM bookings
  WHERE stripe_session_id IS NOT NULL
)
UPDATE bookings
SET stripe_session_id = NULL
FROM ranked_sessions
WHERE bookings.id = ranked_sessions.id
  AND ranked_sessions.duplicate_number > 1;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_stripe_session_unique_idx
  ON bookings(stripe_session_id);