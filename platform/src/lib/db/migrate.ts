import { createClient } from "@libsql/client";

/**
 * Minimal bootstrap: creates tables directly (no migration history) so a fresh
 * clone works without running drizzle-kit generate/push. Switch to drizzle-kit
 * migrations once the schema stabilizes.
 */
async function main() {
  const client = createClient({
    url: process.env.DATABASE_URL ?? "file:./local.db",
  });

  await client.execute(`
    CREATE TABLE IF NOT EXISTS engagements (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      industry TEXT,
      company_size TEXT,
      objective TEXT NOT NULL,
      current_baseline TEXT,
      constraints TEXT,
      raw_intake TEXT,
      phase TEXT NOT NULL DEFAULT 'qualification',
      status TEXT NOT NULL DEFAULT 'active',
      created_at TEXT NOT NULL DEFAULT (current_timestamp),
      updated_at TEXT NOT NULL DEFAULT (current_timestamp)
    );
  `);

  // Idempotent forward-migration for databases created before raw_intake existed.
  try {
    await client.execute(`ALTER TABLE engagements ADD COLUMN raw_intake TEXT;`);
  } catch {
    // Column already exists — safe to ignore.
  }

  await client.execute(`
    CREATE TABLE IF NOT EXISTS phase_runs (
      id TEXT PRIMARY KEY,
      engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
      phase_key TEXT NOT NULL,
      agent_key TEXT NOT NULL,
      agent_name TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      model TEXT,
      output_markdown TEXT,
      prompt_tokens INTEGER,
      completion_tokens INTEGER,
      error_message TEXT,
      started_at TEXT,
      completed_at TEXT,
      created_at TEXT NOT NULL DEFAULT (current_timestamp)
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      engagement_id TEXT NOT NULL REFERENCES engagements(id) ON DELETE CASCADE,
      version INTEGER NOT NULL DEFAULT 1,
      html_content TEXT NOT NULL,
      generated_at TEXT NOT NULL DEFAULT (current_timestamp)
    );
  `);

  console.log("Database schema is ready.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
