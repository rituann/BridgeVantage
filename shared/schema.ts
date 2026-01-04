import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  department: text("department").notNull(),
  tenure: integer("tenure").notNull(),
  level: integer("level").notNull(),
  skills: jsonb("skills").notNull().$type<Record<string, number>>(),
  risk: text("risk"),
  digitalLiteracy: integer("digital_literacy").default(1),
  careerGoals: text("career_goals"),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

export const updateEmployeeSchema = createInsertSchema(employees).partial().omit({
  id: true,
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type UpdateEmployee = z.infer<typeof updateEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

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
