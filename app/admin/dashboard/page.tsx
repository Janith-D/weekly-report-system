import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { SubmissionStatusChart } from "@/components/dashboard/SubmissionStatusChart";
import { TaskTrendChart } from "@/components/dashboard/TaskTrendChart";
import { ProjectDistributionChart } from "@/components/dashboard/ProjectDistributionChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { AIChatWidget } from "@/components/ai/AIChatWidget";
import Link from "next/link";
import { Users, Settings } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  if (role !== "ADMIN") redirect("/login");

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay() + 1);
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const totalMembers = await prisma.user.count({
    where: { role: "TEAM_MEMBER" },
  });

  const submittedReports = await prisma.weeklyReport.count({
    where: {
      reportStatus: "SUBMITTED",
      weekStartDate: { gte: weekStart },
      weekEndDate: { lte: weekEnd },
    },
  });

  const lateReports = await prisma.weeklyReport.count({
    where: {
      reportStatus: "LATE",
      weekStartDate: { gte: weekStart },
      weekEndDate: { lte: weekEnd },
    },
  });

  const pendingReports = Math.max(0, totalMembers - submittedReports - lateReports);
  const blockedReports = await prisma.weeklyReport.count({
    where: { workStatus: "BLOCKED" },
  });

  const hoursResult = await prisma.weeklyReport.aggregate({
    _sum: { hoursWorked: true },
    where: {
      weekStartDate: { gte: weekStart },
      weekEndDate: { lte: weekEnd },
    },
  });

  const totalHours = hoursResult._sum.hoursWorked || 0;
  const complianceRate =
    totalMembers > 0
      ? Math.round((submittedReports / totalMembers) * 100)
      : 0;

  const allReports = await prisma.weeklyReport.findMany({
    include: {
      user: { select: { name: true } },
      project: { select: { name: true } },
    },
    orderBy: { weekStartDate: "desc" },
    take: 50,
  });

  const submissionStatusData = allReports.reduce(
    (acc: Record<string, { submitted: number; pending: number; late: number }>, report) => {
      const name = report.user.name;
      if (!acc[name]) acc[name] = { submitted: 0, pending: 0, late: 0 };
      if (report.reportStatus === "SUBMITTED") acc[name].submitted++;
      else if (report.reportStatus === "LATE") acc[name].late++;
      else acc[name].pending++;
      return acc;
    },
    {}
  );

  const submissionChartData = Object.entries(submissionStatusData).map(
    ([name, data]) => ({ name, ...data })
  );

  const weeksMap = allReports.reduce((acc: Record<string, number>, report) => {
    const weekKey = new Date(report.weekStartDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    acc[weekKey] = (acc[weekKey] || 0) + 1;
    return acc;
  }, {});

  const taskTrendData = Object.entries(weeksMap).map(([week, tasks]) => ({
    week,
    tasks,
  }));

  const projectMap = allReports.reduce((acc: Record<string, number>, report) => {
    acc[report.project.name] = (acc[report.project.name] || 0) + 1;
    return acc;
  }, {});

  const projectChartData = Object.entries(projectMap).map(([name, value]) => ({
    name,
    value,
  }));

  const activities = await prisma.activityLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Overview of team activity and system management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/users"
              className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <Users className="w-4 h-4" /> Manage Users
            </Link>
          </div>
        </div>

        <SummaryCards
          metrics={{
            totalSubmitted: submittedReports,
            complianceRate,
            pendingReports,
            lateReports,
            openBlockers: blockedReports,
            totalHours,
          }}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          <SubmissionStatusChart data={submissionChartData} />
          <TaskTrendChart data={taskTrendData} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <ProjectDistributionChart data={projectChartData} />
          <ActivityFeed
            activities={activities.map((a) => ({
              ...a,
              createdAt: a.createdAt.toISOString(),
            }))}
          />
        </div>
      </div>

      <AIChatWidget />
    </DashboardLayout>
  );
}
