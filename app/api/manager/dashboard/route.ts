import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "MANAGER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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

  const complianceRate =
    totalMembers > 0
      ? Math.round((submittedReports / totalMembers) * 100)
      : 0;

  return NextResponse.json({
    totalSubmitted: submittedReports,
    complianceRate,
    pendingReports,
    lateReports,
    openBlockers: blockedReports,
    totalHours: hoursResult._sum.hoursWorked || 0,
  });
}
