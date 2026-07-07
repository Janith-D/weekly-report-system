import { prisma } from "./prisma";

export interface AIReportContext {
  selectedWeek: string;
  reports: Array<{
    member: string;
    project: string;
    tasksCompleted: string;
    blockers: string | null;
    hoursWorked: number | null;
    workStatus: string;
  }>;
}

export async function getAIReportContext(): Promise<AIReportContext> {
  const reports = await prisma.weeklyReport.findMany({
    include: {
      user: { select: { name: true } },
      project: { select: { name: true } },
    },
    orderBy: { weekStartDate: "desc" },
    take: 20,
  });

  return {
    selectedWeek: "All available weeks",
    reports: reports.map((r) => ({
      member: r.user.name,
      project: r.project.name,
      tasksCompleted: r.tasksCompleted,
      blockers: r.blockersChallenges,
      hoursWorked: r.hoursWorked,
      workStatus: r.workStatus,
    })),
  };
}

export function generateMockResponse(query: string, context: AIReportContext): string {
  const reports = context.reports;
  if (reports.length === 0) {
    return "No report data is available.";
  }

  const q = query.toLowerCase();

  if (q.includes("blocker")) {
    const blocked = reports.filter((r) => r.blockers && r.blockers.trim().length > 0);
    if (blocked.length === 0) return "No blockers were reported.";
    return `The following team members reported blockers:\n${blocked.map((r) => `- ${r.member} (${r.project}): ${r.blockers}`).join("\n")}`;
  }

  if (q.includes("complete") || q.includes("done") || q.includes("work")) {
    return `The team completed:\n${reports.map((r) => `- ${r.member} (${r.project}): ${r.tasksCompleted}`).join("\n")}`;
  }

  if (q.includes("hour") || q.includes("workload") || q.includes("time")) {
    const totalHours = reports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    return `Total hours logged: ${totalHours} hours across ${reports.length} reports.`;
  }

  if (q.includes("summary") || q.includes("overview")) {
    const totalHours = reports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    const blocked = reports.filter((r) => r.workStatus === "BLOCKED").length;
    return `Team Summary:\n- ${reports.length} reports\n- ${totalHours} total hours\n- ${blocked} blocker(s)\n- Work: ${reports.map((r) => r.tasksCompleted).join("; ")}`;
  }

  return `I have ${reports.length} reports available. Ask about completed tasks, blockers, hours, or summaries.`;
}
