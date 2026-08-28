import "dotenv/config";
import { runAppMigrations } from "../server/migrations";
import pool from "../server/db";

runAppMigrations()
  .then(async () => {
    await pool.end();
  })
  .catch(async (error) => {
    console.error("❌ Database migration failed:", error);
    await pool.end();
    process.exitCode = 1;
  });