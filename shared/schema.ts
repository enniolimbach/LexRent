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

// Contract data schema for OCR extraction (Phase 2 extended)
export const contractDataSchema = z.object({
  net_rent: z.number().positive(),
  reference_rate_contract: z.number(),
  contract_date: z.string(), // ISO date string
  address: z.string(),
  kanton: z.string().optional(),
  last_increase: z.string().nullable().optional(),
  improvements: z.boolean().optional(),
  current_reference_rate: z.number(),
  inflation_since_contract: z.number(),
  cost_increase_per_year: z.number(),
  gross_rent: z.number().positive().optional(), // Phase 2
  ziel: z.enum(["nur Prüfung", "Brief"]).optional(), // Phase 2
});

export type ContractData = z.infer<typeof contractDataSchema>;

// Dialog state and question types
export enum DialogField {
  LAST_INCREASE = "last_increase",
  IMPROVEMENTS = "improvements",
  KANTON = "kanton",
  GROSS_RENT = "gross_rent",
  ZIEL = "ziel",
}

export interface DialogQuestion {
  field: DialogField;
  question: string;
  type: "text" | "boolean" | "date" | "select";
  options?: string[];
  placeholder?: string;
}

export interface DialogMessage {
  id: string;
  type: "question" | "answer" | "system";
  content: string;
  timestamp: Date;
  field?: DialogField;
}

export interface DialogState {
  currentField: DialogField | null;
  missingFields: DialogField[];
  completedFields: DialogField[];
  totalQuestions: number;
  currentQuestionIndex: number;
  isComplete: boolean;
}

// Calculation result types (Phase 3)
export interface CalculationResult {
  isReductionPossible: boolean;
  rateDifferential: number;
  interestReductionPercent: number;
  yearsSinceAdjustment: number;
  costIncreasePercent: number;
  inflationAdjustmentPercent: number;
  effectiveReductionPercent: number;
  currentRent: number;
  newRent: number;
  monthlySavings: number;
  annualSavings: number;
  explanationDe: string;
  detailedBreakdown: {
    step: string;
    value: string;
    explanation: string;
  }[];
}
