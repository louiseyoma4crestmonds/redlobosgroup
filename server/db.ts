import { Pool } from "pg";

const useDatabaseSsl =
  process.env.DATABASE_SSL !== undefined
    ? process.env.DATABASE_SSL === "true"
    : process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useDatabaseSsl ? { rejectUnauthorized: false } : false,
});

export default pool;
