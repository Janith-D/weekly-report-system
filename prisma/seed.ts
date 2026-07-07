import "dotenv/config";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@company.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@company.com",
      password,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@company.com" },
    update: {},
    create: {
      name: "Manager User",
      email: "manager@company.com",
      password,
      role: Role.MANAGER,
    },
  });

  const members = await Promise.all([
    prisma.user.upsert({
      where: { email: "alice@company.com" },
      update: {},
      create: {
        name: "Alice Johnson",
        email: "alice@company.com",
        password,
        role: Role.TEAM_MEMBER,
      },
    }),
    prisma.user.upsert({
      where: { email: "bob@company.com" },
      update: {},
      create: {
        name: "Bob Smith",
        email: "bob@company.com",
        password,
        role: Role.TEAM_MEMBER,
      },
    }),
    prisma.user.upsert({
      where: { email: "charlie@company.com" },
      update: {},
      create: {
        name: "Charlie Brown",
        email: "charlie@company.com",
        password,
        role: Role.TEAM_MEMBER,
      },
    }),
  ]);

  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: "project-client-a" },
      update: {},
      create: {
        id: "project-client-a",
        name: "Client A",
        description: "Client A project work",
      },
    }),
    prisma.project.upsert({
      where: { id: "project-internal-tooling" },
      update: {},
      create: {
        id: "project-internal-tooling",
        name: "Internal Tooling",
        description: "Internal tools and infrastructure",
      },
    }),
    prisma.project.upsert({
      where: { id: "project-rd" },
      update: {},
      create: {
        id: "project-rd",
        name: "R&D",
        description: "Research and development",
      },
    }),
    prisma.project.upsert({
      where: { id: "project-marketing" },
      update: {},
      create: {
        id: "project-marketing",
        name: "Marketing",
        description: "Marketing initiatives",
      },
    }),
    prisma.project.upsert({
      where: { id: "project-bug-fixing" },
      update: {},
      create: {
        id: "project-bug-fixing",
        name: "Bug Fixing",
        description: "Bug fixes and maintenance",
      },
    }),
    prisma.project.upsert({
      where: { id: "project-backend" },
      update: {},
      create: {
        id: "project-backend",
        name: "Backend Development",
        description: "Backend development work",
      },
    }),
  ]);

  console.log("Seed completed!");
  console.log("Login credentials (all users): password123");
  console.log("Admin: admin@company.com");
  console.log("Manager: manager@company.com");
  console.log("Members: alice@company.com, bob@company.com, charlie@company.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
