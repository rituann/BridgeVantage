import { employees, type Employee, type InsertEmployee, type UpdateEmployee } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllEmployees(): Promise<Employee[]>;
  getEmployee(id: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, employee: UpdateEmployee): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  seedEmployees(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getAllEmployees(): Promise<Employee[]> {
    return db.select().from(employees);
  }

  async getEmployee(id: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db
      .insert(employees)
      .values(insertEmployee)
      .returning();
    return employee;
  }

  async updateEmployee(id: string, updateData: UpdateEmployee): Promise<Employee | undefined> {
    const [employee] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, id))
      .returning();
    return employee || undefined;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id)).returning();
    return result.length > 0;
  }

  async seedEmployees(): Promise<void> {
    const existing = await this.getAllEmployees();
    if (existing.length > 0) {
      return;
    }

    const seedData: InsertEmployee[] = [
      {
        name: "Robert",
        department: "Legacy Ops",
        tenure: 18,
        level: 3,
        skills: { Mechanical: 9, Precision: 9, IoT: 2 },
        risk: "Underutilized",
        digitalLiteracy: 2,
        careerGoals: "",
      },
      {
        name: "Maya",
        department: "Automation",
        tenure: 2,
        level: 6,
        skills: { AI: 9, Python: 8, Domain_Wisdom: 3 },
        risk: "Needs Context",
        digitalLiteracy: 9,
        careerGoals: "",
      },
      {
        name: "Elena",
        department: "Legacy Ops",
        tenure: 22,
        level: 4,
        skills: { QA: 10, Safety: 9 },
        risk: "High Flight Risk",
        digitalLiteracy: 3,
        careerGoals: "",
      },
      {
        name: "James",
        department: "Digital Sys",
        tenure: 1,
        level: 4,
        skills: { Cloud: 8, Security: 7 },
        risk: null,
        digitalLiteracy: 8,
        careerGoals: "",
      },
      {
        name: "David",
        department: "Automation",
        tenure: 4,
        level: 5,
        skills: { Robotics: 8, Legacy_Mechanics: 6 },
        risk: null,
        digitalLiteracy: 7,
        careerGoals: "",
      },
      {
        name: "Sarah",
        department: "Digital Sys",
        tenure: 3,
        level: 3,
        skills: { Analytics: 7, UX: 6 },
        risk: null,
        digitalLiteracy: 7,
        careerGoals: "",
      },
      {
        name: "Frank",
        department: "Legacy Ops",
        tenure: 15,
        level: 2,
        skills: { Tooling: 9 },
        risk: null,
        digitalLiteracy: 2,
        careerGoals: "",
      },
      {
        name: "Chloe",
        department: "Automation",
        tenure: 1,
        level: 3,
        skills: { Design: 8 },
        risk: null,
        digitalLiteracy: 8,
        careerGoals: "",
      },
      {
        name: "Tom",
        department: "Digital Sys",
        tenure: 8,
        level: 5,
        skills: { Cyber: 9 },
        risk: null,
        digitalLiteracy: 9,
        careerGoals: "",
      },
      {
        name: "Lisa",
        department: "Legacy Ops",
        tenure: 12,
        level: 3,
        skills: { Supply_Chain: 8 },
        risk: null,
        digitalLiteracy: 4,
        careerGoals: "",
      },
    ];

    for (const employee of seedData) {
      await this.createEmployee(employee);
    }
  }
}

export const storage = new DatabaseStorage();
