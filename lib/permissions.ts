import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { Role } from "@prisma/client";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user as
    | { id: string; name: string; email: string; role: Role }
    | undefined;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}

export function canManageReports(userRole: Role) {
  return userRole === "MANAGER" || userRole === "ADMIN";
}

export function canManageProjects(userRole: Role) {
  return userRole === "MANAGER" || userRole === "ADMIN";
}

export function canManageUsers(userRole: Role) {
  return userRole === "ADMIN";
}
