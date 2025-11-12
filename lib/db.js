import { Pool } from "pg";
import fs from "fs";
import path from "path";

const globalForDb = globalThis;

const tableSql = fs
  .readFileSync(path.join(process.cwd(), "sql/001_create_entries.sql"), "utf8")
  .trim();

let tableReadyPromise = null;

function getDatabaseUrl() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const parsed = new URL(rawUrl);
  if (!parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }

  return parsed.toString();
}

function createPool() {
  const connectionString = getDatabaseUrl();
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  return pool;
}

export const pool =
  globalForDb.__dbPool ?? createPool();

if (process.env.NODE_ENV !== "production") {
  globalForDb.__dbPool = pool;
}

async function ensureTable() {
  if (!tableReadyPromise) {
    tableReadyPromise = pool.query(tableSql).catch((error) => {
      tableReadyPromise = null;
      throw error;
    });
  }
  return tableReadyPromise;
}

export async function query(text, params = []) {
  await ensureTable();
  return pool.query(text, params);
}

export async function closePool() {
  await pool.end();
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__dbPool = undefined;
  }
}

