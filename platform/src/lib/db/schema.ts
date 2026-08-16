import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const engagements = sqliteTable("engagements", {
  id: text("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  industry: text("industry"),
  companySize: text("company_size"),
  objective: text("objective").notNull(),
  currentBaseline: text("current_baseline"),
  constraints: text("constraints"),
  rawIntake: text("raw_intake"),
  phase: text("phase").notNull().default("qualification"),
  status: text("status").notNull().default("active"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const phaseRuns = sqliteTable("phase_runs", {
  id: text("id").primaryKey(),
  engagementId: text("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  phaseKey: text("phase_key").notNull(),
  agentKey: text("agent_key").notNull(),
  agentName: text("agent_name").notNull(),
  status: text("status").notNull().default("pending"),
  model: text("model"),
  outputMarkdown: text("output_markdown"),
  promptTokens: integer("prompt_tokens"),
  completionTokens: integer("completion_tokens"),
  errorMessage: text("error_message"),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export const reports = sqliteTable("reports", {
  id: text("id").primaryKey(),
  engagementId: text("engagement_id")
    .notNull()
    .references(() => engagements.id, { onDelete: "cascade" }),
  version: integer("version").notNull().default(1),
  htmlContent: text("html_content").notNull(),
  generatedAt: text("generated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
});

export type Engagement = typeof engagements.$inferSelect;
export type NewEngagement = typeof engagements.$inferInsert;
export type PhaseRun = typeof phaseRuns.$inferSelect;
export type NewPhaseRun = typeof phaseRuns.$inferInsert;
export type Report = typeof reports.$inferSelect;
