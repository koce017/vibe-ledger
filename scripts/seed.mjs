import "dotenv/config"
import { query, closePool } from "../lib/db.js";

const SAMPLE_ENTRIES = [
  {
    project: "vibe-ledger",
    type: "UI",
    prompt: "Initial layout concept",
    details: "Sketched dashboard tiles for quick project context.",
  },
  {
    project: "vibe-ledger",
    type: "API",
    prompt: "Connected Neon database",
    details: "Verified SSL connection and seeded starter content.",
  },
];

async function seed() {
  try {
    for (const entry of SAMPLE_ENTRIES) {
      await query(
        `INSERT INTO entries (project, type, prompt, details)
         VALUES ($1, $2, $3, $4)`,
        [entry.project, entry.type, entry.prompt, entry.details]
      );
    }
    console.log(`Inserted ${SAMPLE_ENTRIES.length} sample entries.`);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}

seed();

