import { readdir, readFile } from "fs/promises";
import path from "path";
import pool from "./db";

const MIGRATION_LOCK_KEY = "red_lobos_application_schema";
const MIGRATIONS_TABLE = "application_migrations";

function migrationDirectory() {
  return path.resolve(process.cwd(), "migrations");
}

export async function runAppMigrations() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required. The application cannot start without a database."
    );
  }

  const files = (await readdir(migrationDirectory()))
    .filter((file) => /^\d+_[a-z0-9_-]+\.sql$/i.test(file))
    .sort();

  if (files.length === 0) {
    throw new Error(`No database migrations found in ${migrationDirectory()}.`);
  }

  const client = await pool.connect();
  let lockAcquired = false;

  try {
    await client.query("SELECT pg_advisory_lock(hashtext($1))", [
      MIGRATION_LOCK_KEY,
    ]);
    lockAcquired = true;

    await client.query(`
      CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await client.query(
      `SELECT version FROM ${MIGRATIONS_TABLE}`
    );
    const applied = new Set(
      appliedResult.rows.map((row: { version: string }) => row.version)
    );

    for (const file of files) {
      if (applied.has(file)) continue;

      const sql = await readFile(path.join(migrationDirectory(), file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query(
          `INSERT INTO ${MIGRATIONS_TABLE} (version) VALUES ($1)`,
          [file]
        );
        await client.query("COMMIT");
        console.log(`✅ Applied database migration ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }
  } finally {
    if (lockAcquired) {
      await client.query("SELECT pg_advisory_unlock(hashtext($1))", [
        MIGRATION_LOCK_KEY,
      ]);
    }
    client.release();
  }
}