var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// api/_server.ts
import express from "express";
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  employees: () => employees,
  insertEmployeeSchema: () => insertEmployeeSchema,
  insertUserSchema: () => insertUserSchema,
  updateEmployeeSchema: () => updateEmployeeSchema,
  users: () => users
});
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  department: text("department").notNull(),
  tenure: integer("tenure").notNull(),
  level: integer("level").notNull(),
  skills: jsonb("skills").notNull().$type(),
  risk: text("risk"),
  digitalLiteracy: integer("digital_literacy").default(1),
  careerGoals: text("career_goals")
});
var insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true
});
var updateEmployeeSchema = createInsertSchema(employees).partial().omit({
  id: true
});
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/db.ts
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
var { Pool } = pg;
var pool;
var db;
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema: schema_exports });
} else {
  console.warn("DATABASE_URL not set \u2014 using in-memory storage.");
}

// server/storage.ts
import { eq } from "drizzle-orm";
var SEED_DATA = [
  { name: "Robert", department: "Legacy Ops", tenure: 18, level: 3, skills: { Mechanical: 9, Precision: 9, IoT: 2 }, risk: "Underutilized", digitalLiteracy: 2, careerGoals: "" },
  { name: "Maya", department: "Automation", tenure: 2, level: 6, skills: { AI: 9, Python: 8, Domain_Wisdom: 3 }, risk: "Needs Context", digitalLiteracy: 9, careerGoals: "" },
  { name: "Elena", department: "Legacy Ops", tenure: 22, level: 4, skills: { QA: 10, Safety: 9 }, risk: "High Flight Risk", digitalLiteracy: 3, careerGoals: "" },
  { name: "James", department: "Digital Sys", tenure: 1, level: 4, skills: { Cloud: 8, Security: 7 }, risk: null, digitalLiteracy: 8, careerGoals: "" },
  { name: "David", department: "Automation", tenure: 4, level: 5, skills: { Robotics: 8, Legacy_Mechanics: 6 }, risk: null, digitalLiteracy: 7, careerGoals: "" },
  { name: "Sarah", department: "Digital Sys", tenure: 3, level: 3, skills: { Analytics: 7, UX: 6 }, risk: null, digitalLiteracy: 7, careerGoals: "" },
  { name: "Frank", department: "Legacy Ops", tenure: 15, level: 2, skills: { Tooling: 9 }, risk: null, digitalLiteracy: 2, careerGoals: "" },
  { name: "Chloe", department: "Automation", tenure: 1, level: 3, skills: { Design: 8 }, risk: null, digitalLiteracy: 8, careerGoals: "" },
  { name: "Tom", department: "Digital Sys", tenure: 8, level: 5, skills: { Cyber: 9 }, risk: null, digitalLiteracy: 9, careerGoals: "" },
  { name: "Lisa", department: "Legacy Ops", tenure: 12, level: 3, skills: { Supply_Chain: 8 }, risk: null, digitalLiteracy: 4, careerGoals: "" }
];
var MemStorage = class {
  store = /* @__PURE__ */ new Map();
  constructor() {
    for (const data of SEED_DATA) {
      const id = randomUUID();
      this.store.set(id, { id, digitalLiteracy: 1, careerGoals: null, risk: null, ...data });
    }
  }
  async getAllEmployees() {
    return Array.from(this.store.values());
  }
  async getEmployee(id) {
    return this.store.get(id);
  }
  async createEmployee(data) {
    const id = randomUUID();
    const employee = { id, digitalLiteracy: 1, careerGoals: null, risk: null, ...data };
    this.store.set(id, employee);
    return employee;
  }
  async updateEmployee(id, data) {
    const existing = this.store.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...data };
    this.store.set(id, updated);
    return updated;
  }
  async deleteEmployee(id) {
    return this.store.delete(id);
  }
  async seedEmployees() {
    if (this.store.size > 0) return;
    for (const data of SEED_DATA) {
      await this.createEmployee(data);
    }
  }
};
var DatabaseStorage = class {
  async getAllEmployees() {
    if (!db) throw new Error("Database not configured");
    return db.select().from(employees);
  }
  async getEmployee(id) {
    if (!db) throw new Error("Database not configured");
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || void 0;
  }
  async createEmployee(insertEmployee) {
    if (!db) throw new Error("Database not configured");
    const [employee] = await db.insert(employees).values(insertEmployee).returning();
    return employee;
  }
  async updateEmployee(id, updateData) {
    if (!db) throw new Error("Database not configured");
    const [employee] = await db.update(employees).set(updateData).where(eq(employees.id, id)).returning();
    return employee || void 0;
  }
  async deleteEmployee(id) {
    if (!db) throw new Error("Database not configured");
    const result = await db.delete(employees).where(eq(employees.id, id)).returning();
    return result.length > 0;
  }
  async seedEmployees() {
    if (!db) throw new Error("Database not configured");
    const existing = await this.getAllEmployees();
    if (existing.length > 0) return;
    for (const employee of SEED_DATA) {
      await this.createEmployee(employee);
    }
  }
};
var storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

// server/routes.ts
async function registerRoutes(httpServer2, app2) {
  await storage.seedEmployees();
  app2.get("/api/employees", async (_req, res) => {
    try {
      const employees2 = await storage.getAllEmployees();
      res.json(employees2);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });
  app2.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployee(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });
  app2.post("/api/employees", async (req, res) => {
    try {
      const parseResult = insertEmployeeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error.errors });
      }
      const employee = await storage.createEmployee(parseResult.data);
      res.status(201).json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Failed to create employee" });
    }
  });
  app2.post("/api/seed", async (_req, res) => {
    try {
      const all = await storage.getAllEmployees();
      for (const e of all) await storage.deleteEmployee(e.id);
      await storage.seedEmployees();
      res.json({ success: true });
    } catch (error) {
      console.error("Error seeding employees:", error);
      res.status(500).json({ error: "Failed to seed employees" });
    }
  });
  app2.patch("/api/employees/:id", async (req, res) => {
    try {
      const parseResult = updateEmployeeSchema.safeParse(req.body);
      if (!parseResult.success) {
        return res.status(400).json({ error: "Invalid request body", details: parseResult.error.errors });
      }
      const employee = await storage.updateEmployee(req.params.id, parseResult.data);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ error: "Failed to update employee" });
    }
  });
  return httpServer2;
}

// api/_server.ts
var app = express();
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: false }));
var httpServer = createServer(app);
var ready = registerRoutes(httpServer, app);
async function handler(req, res) {
  await ready;
  app(req, res);
}
export {
  handler as default
};
