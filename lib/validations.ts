import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const weeklyReportSchema = z.object({
  weekStartDate: z.string().min(1, "Week start date is required"),
  weekEndDate: z.string().min(1, "Week end date is required"),
  projectId: z.string().min(1, "Project/category is required"),
  tasksCompleted: z
    .string()
    .min(10, "Please describe completed tasks (min 10 characters)"),
  tasksPlannedNextWeek: z
    .string()
    .min(10, "Please describe next week's planned tasks (min 10 characters)"),
  blockersChallenges: z.string().optional().default(""),
  hoursWorked: z.coerce.number().min(0).optional().default(0),
  notesLinks: z.string().optional().default(""),
  workStatus: z.enum(["ON_TRACK", "AT_RISK", "BLOCKED"]),
});

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional().default(""),
  isActive: z.boolean().optional().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type WeeklyReportInput = z.infer<typeof weeklyReportSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
