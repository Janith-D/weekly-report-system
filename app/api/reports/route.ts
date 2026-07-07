import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  const where =
    role === "TEAM_MEMBER" ? { userId } : {};

  const reports = await prisma.weeklyReport.findMany({
    where,
    include: { project: true, user: { select: { name: true } } },
    orderBy: { weekStartDate: "desc" },
  });

  return NextResponse.json(reports);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await req.json();

    if (!body.weekStartDate || !body.weekEndDate) {
      return NextResponse.json(
        { error: "Week start and end dates are required" },
        { status: 400 }
      );
    }

    if (!body.projectId) {
      return NextResponse.json(
        { error: "Project is required" },
        { status: 400 }
      );
    }

    const existing = await prisma.weeklyReport.findFirst({
      where: {
        userId,
        weekStartDate: new Date(body.weekStartDate),
        weekEndDate: new Date(body.weekEndDate),
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A report already exists for this week" },
        { status: 409 }
      );
    }

    const report = await prisma.weeklyReport.create({
      data: {
        userId,
        projectId: body.projectId,
        weekStartDate: new Date(body.weekStartDate),
        weekEndDate: new Date(body.weekEndDate),
        tasksCompleted: body.tasksCompleted,
        tasksPlannedNextWeek: body.tasksPlannedNextWeek,
        blockersChallenges: body.blockersChallenges || null,
        hoursWorked: body.hoursWorked || null,
        notesLinks: body.notesLinks || null,
        workStatus: body.workStatus || "ON_TRACK",
        reportStatus: body.reportStatus || "DRAFT",
        submittedAt:
          body.reportStatus === "SUBMITTED" ? new Date() : null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "REPORT_SUBMITTED",
        description: `${session.user.name} created a new report`,
        userId,
        reportId: report.id,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
