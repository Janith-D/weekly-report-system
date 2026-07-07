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

export async function getAIReportContext(
  weekStart: Date,
  weekEnd: Date
): Promise<AIReportContext> {
  const reports = await prisma.weeklyReport.findMany({
    where: {
      weekStartDate: weekStart,
      weekEndDate: weekEnd,
      reportStatus: "SUBMITTED",
    },
    include: {
      user: { select: { name: true } },
      project: { select: { name: true } },
    },
  });

  return {
    selectedWeek: `${weekStart.toISOString().split("T")[0]} to ${weekEnd.toISOString().split("T")[0]}`,
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

export function generateSystemPrompt(context: AIReportContext): string {
  return `You are an internal team reporting assistant. Answer only using the weekly report data provided below. Do not invent team activity, project names, blockers, hours, or user names. If the answer is not available in the provided reports, say that the data is not available.

Context for ${context.selectedWeek}:
${JSON.stringify(context.reports, null, 2)}`;
}

export function generateMockResponse(query: string, context: AIReportContext): string {
  const reports = context.reports;
  if (reports.length === 0) {
    return "No report data is available for the selected week.";
  }

  const query_lower = query.toLowerCase();

  if (query_lower.includes("blocker")) {
    const blocked = reports.filter((r) => r.blockers && r.blockers.trim().length > 0);
    if (blocked.length === 0) return "No blockers were reported this week.";
    return `The following team members reported blockers:\n${blocked.map((r) => `- ${r.member} (${r.project}): ${r.blockers}`).join("\n")}`;
  }

  if (query_lower.includes("complete") || query_lower.includes("done") || query_lower.includes("work")) {
    return `This week, the team completed the following:\n${reports.map((r) => `- ${r.member} (${r.project}): ${r.tasksCompleted}`).join("\n")}`;
  }

  if (query_lower.includes("hour") || query_lower.includes("workload") || query_lower.includes("time")) {
    const totalHours = reports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    return `Total hours logged this week: ${totalHours} hours across ${reports.length} team members.`;
  }

  if (query_lower.includes("summary") || query_lower.includes("overview")) {
    const totalHours = reports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    const blocked = reports.filter((r) => r.workStatus === "BLOCKED").length;
    return `Team Summary for ${context.selectedWeek}:\n- ${reports.length} reports submitted\n- ${totalHours} total hours worked\n- ${blocked} blocker(s) reported\n- Work includes: ${reports.map((r) => r.tasksCompleted).join("; ")}`;
  }

  return `Based on the ${reports.length} reports available for ${context.selectedWeek}, I can help answer questions about completed tasks, blockers, hours worked, and team summaries. What would you like to know?`;
}
