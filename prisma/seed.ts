import "dotenv/config";
import { prisma } from "../lib/prisma";
import { Role, ReportStatus, WorkStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Seeding database...");

  const password = await bcrypt.hash("password123", 12);

  // ── Users ──
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

  const alice = await prisma.user.upsert({
    where: { email: "alice@company.com" },
    update: {},
    create: {
      name: "Alice Johnson", email: "alice@company.com", password,
      role: Role.TEAM_MEMBER,
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@company.com" },
    update: {},
    create: {
      name: "Bob Smith", email: "bob@company.com", password,
      role: Role.TEAM_MEMBER,
    },
  });
  const charlie = await prisma.user.upsert({
    where: { email: "charlie@company.com" },
    update: {},
    create: {
      name: "Charlie Brown", email: "charlie@company.com", password,
      role: Role.TEAM_MEMBER,
    },
  });

  // ── Projects ──
  const projects = await Promise.all([
    prisma.project.upsert({
      where: { id: "proj-client-a" }, update: {},
      create: { id: "proj-client-a", name: "Client A", description: "Client A project work" },
    }),
    prisma.project.upsert({
      where: { id: "proj-internal-tooling" }, update: {},
      create: { id: "proj-internal-tooling", name: "Internal Tooling", description: "Internal tools and infrastructure" },
    }),
    prisma.project.upsert({
      where: { id: "proj-rd" }, update: {},
      create: { id: "proj-rd", name: "R&D", description: "Research and development" },
    }),
    prisma.project.upsert({
      where: { id: "proj-marketing" }, update: {},
      create: { id: "proj-marketing", name: "Marketing", description: "Marketing initiatives" },
    }),
    prisma.project.upsert({
      where: { id: "proj-bug-fixing" }, update: {},
      create: { id: "proj-bug-fixing", name: "Bug Fixing", description: "Bug fixes and maintenance" },
    }),
    prisma.project.upsert({
      where: { id: "proj-backend" }, update: {},
      create: { id: "proj-backend", name: "Backend Development", description: "Backend development work" },
    }),
    prisma.project.upsert({
      where: { id: "proj-ui-ux" }, update: {},
      create: { id: "proj-ui-ux", name: "UI/UX Design", description: "User interface and experience design" },
    }),
  ]);

  const [clientA, internalTooling, rd, marketing, bugFixing, backend, uiUx] = projects;

  // ── Helper to create weeks ──
  function weekDates(weeksAgo: number) {
    const now = new Date();
    const day = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1) - weeksAgo * 7);
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    sun.setHours(23, 59, 59, 999);
    return { start: mon, end: sun };
  }

  function formatDate(d: Date) {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  // ── Report templates ──
  interface ReportSeed {
    userId: string;
    projectId: string;
    tasksCompleted: string;
    tasksPlannedNextWeek: string;
    blockersChallenges: string | null;
    hoursWorked: number;
    workStatus: WorkStatus;
    reportStatus: ReportStatus;
  }

  const weeks = [0, 1, 2, 3]; // current, 1wk ago, 2wk ago, 3wk ago

  const templates: Record<string, ReportSeed[]> = {
    alice: [
      {
        userId: alice.id, projectId: internalTooling.id,
        tasksCompleted: "Implemented user authentication flow with NextAuth. Built login and registration pages with form validation.",
        tasksPlannedNextWeek: "Add OAuth providers (Google, GitHub) and implement password reset flow.",
        blockersChallenges: "Waiting for database credentials from DevOps",
        hoursWorked: 24, workStatus: WorkStatus.AT_RISK, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: alice.id, projectId: backend.id,
        tasksCompleted: "Designed and implemented REST API endpoints for weekly reports CRUD. Added Zod validation for all inputs.",
        tasksPlannedNextWeek: "Write unit tests for API routes and add pagination.",
        blockersChallenges: null,
        hoursWorked: 20, workStatus: WorkStatus.ON_TRACK, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: alice.id, projectId: clientA.id,
        tasksCompleted: "Completed client dashboard UI with Recharts integration. Fixed responsive layout issues on mobile.",
        tasksPlannedNextWeek: "Add CSV export feature and data filtering options.",
        blockersChallenges: "Client requested last-minute design changes",
        hoursWorked: 22, workStatus: WorkStatus.BLOCKED, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: alice.id, projectId: uiUx.id,
        tasksCompleted: "Redesigned the report submission form with better UX. Improved mobile responsiveness across all pages.",
        tasksPlannedNextWeek: "Conduct user testing sessions and iterate on feedback.",
        blockersChallenges: null,
        hoursWorked: 18, workStatus: WorkStatus.ON_TRACK, reportStatus: ReportStatus.SUBMITTED,
      },
    ],
    bob: [
      {
        userId: bob.id, projectId: backend.id,
        tasksCompleted: "Optimized database queries and added indexing for faster report loading. Reduced query time by 40%.",
        tasksPlannedNextWeek: "Implement caching layer with Redis for frequently accessed data.",
        blockersChallenges: null,
        hoursWorked: 28, workStatus: WorkStatus.ON_TRACK, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: bob.id, projectId: bugFixing.id,
        tasksCompleted: "Fixed 7 reported bugs including the date picker timezone issue and the CSV encoding problem.",
        tasksPlannedNextWeek: "Continue working through the bug backlog. Prioritize high-severity issues.",
        blockersChallenges: "Third-party library dependency causing build failures on Windows",
        hoursWorked: 16, workStatus: WorkStatus.AT_RISK, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: bob.id, projectId: rd.id,
        tasksCompleted: "Researched and prototyped AI-powered report summarization feature using OpenAI API.",
        tasksPlannedNextWeek: "Build a proof of concept for stakeholder demo next month.",
        blockersChallenges: null,
        hoursWorked: 14, workStatus: WorkStatus.ON_TRACK, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: bob.id, projectId: internalTooling.id,
        tasksCompleted: "Set up CI/CD pipeline with GitHub Actions. Automated deployment to staging environment.",
        tasksPlannedNextWeek: "Add end-to-end tests and configure production deployment.",
        blockersChallenges: null,
        hoursWorked: 20, workStatus: WorkStatus.ON_TRACK, reportStatus: ReportStatus.SUBMITTED,
      },
    ],
    charlie: [
      {
        userId: charlie.id, projectId: marketing.id,
        tasksCompleted: "Created landing page with marketing content and SEO optimization. Set up Google Analytics tracking.",
        tasksPlannedNextWeek: "A/B test landing page variants and optimize conversion funnel.",
        blockersChallenges: "Waiting for marketing team to provide final copy and assets",
        hoursWorked: 18, workStatus: WorkStatus.BLOCKED, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: charlie.id, projectId: clientA.id,
        tasksCompleted: "Built interactive dashboard components with real-time data updates using Server-Sent Events.",
        tasksPlannedNextWeek: "Add export to PDF feature and scheduled report email delivery.",
        blockersChallenges: null,
        hoursWorked: 22, workStatus: WorkStatus.ON_TRACK, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: charlie.id, projectId: uiUx.id,
        tasksCompleted: "Created wireframes and high-fidelity mockups for the analytics dashboard redesign.",
        tasksPlannedNextWeek: "Present designs to stakeholders and incorporate feedback.",
        blockersChallenges: "Unclear requirements from stakeholders on dashboard metrics",
        hoursWorked: 16, workStatus: WorkStatus.AT_RISK, reportStatus: ReportStatus.SUBMITTED,
      },
      {
        userId: charlie.id, projectId: rd.id,
        tasksCompleted: "Explored WebSocket integration for real-time collaboration features. Built a working prototype.",
        tasksPlannedNextWeek: "Evaluate performance and scalability of WebSocket approach vs polling.",
        blockersChallenges: null,
        hoursWorked: 12, workStatus: WorkStatus.ON_TRACK, reportStatus: ReportStatus.SUBMITTED,
      },
    ],
  };

  // ── Create reports for each week ──
  let reportCount = 0;
  for (const weeksAgo of weeks) {
    const { start, end } = weekDates(weeksAgo);
    for (const [memberKey, memberReports] of Object.entries(templates)) {
      const idx = weeksAgo % memberReports.length;
      const tpl = memberReports[idx];

      const existing = await prisma.weeklyReport.findFirst({
        where: { userId: tpl.userId, weekStartDate: start, weekEndDate: end },
      });
      if (existing) continue;

      const isLate = weeksAgo > 0 && Math.random() > 0.7;

      await prisma.weeklyReport.create({
        data: {
          userId: tpl.userId,
          projectId: tpl.projectId,
          weekStartDate: start,
          weekEndDate: end,
          tasksCompleted: tpl.tasksCompleted,
          tasksPlannedNextWeek: tpl.tasksPlannedNextWeek,
          blockersChallenges: tpl.blockersChallenges,
          hoursWorked: tpl.hoursWorked,
          workStatus: tpl.workStatus,
          reportStatus: isLate ? ReportStatus.LATE : tpl.reportStatus,
          submittedAt: isLate ? new Date(end.getTime() + 24 * 60 * 60 * 1000) : new Date(end.getTime() - 60 * 60 * 1000),
        },
      });
      reportCount++;
    }
  }

  // ── Activity logs ──
  const logEntries = [
    { action: "REPORT_SUBMITTED", description: "Alice Johnson submitted weekly report for Internal Tooling", userId: alice.id },
    { action: "REPORT_SUBMITTED", description: "Bob Smith submitted weekly report for Backend Development", userId: bob.id },
    { action: "REPORT_SUBMITTED", description: "Charlie Brown submitted weekly report for Marketing", userId: charlie.id },
    { action: "BLOCKER_REPORTED", description: "Alice Johnson reported a blocker in Internal Tooling", userId: alice.id },
    { action: "BLOCKER_REPORTED", description: "Charlie Brown reported a blocker in Marketing", userId: charlie.id },
    { action: "PROJECT_CREATED", description: "Manager added new project category: UI/UX Design", userId: manager.id },
    { action: "USER_REGISTERED", description: "New team member Charlie Brown joined the workspace", userId: charlie.id },
    { action: "PROJECT_CREATED", description: "Manager added new project category: Backend Development", userId: manager.id },
  ];

  for (const entry of logEntries) {
    const existing = await prisma.activityLog.findFirst({
      where: { description: entry.description },
    });
    if (!existing) {
      await prisma.activityLog.create({ data: entry });
    }
  }

  // ── Project members ──
  const assignments = [
    { userId: alice.id, projectId: internalTooling.id },
    { userId: alice.id, projectId: backend.id },
    { userId: alice.id, projectId: clientA.id },
    { userId: bob.id, projectId: backend.id },
    { userId: bob.id, projectId: bugFixing.id },
    { userId: bob.id, projectId: rd.id },
    { userId: charlie.id, projectId: marketing.id },
    { userId: charlie.id, projectId: clientA.id },
    { userId: charlie.id, projectId: uiUx.id },
  ];

  for (const a of assignments) {
    await prisma.projectMember.upsert({
      where: { userId_projectId: a },
      update: {},
      create: a,
    });
  }

  console.log(`Seed completed! Created ${reportCount} weekly reports.`);
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
