import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, date, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema (existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contract data schema for OCR extraction
export const contractDataSchema = z.object({
  net_rent: z.number().positive(),
  reference_rate_contract: z.number(),
  contract_date: z.string(), // ISO date string
  address: z.string(),
  kanton: z.string(),
  last_increase: z.string().nullable(),
  improvements: z.boolean(),
  current_reference_rate: z.number(),
  inflation_since_contract: z.number(),
  cost_increase_per_year: z.number(),
});

export type ContractData = z.infer<typeof contractDataSchema>;
