import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const report = await prisma.weeklyReport.findUnique({
    where: { id },
    include: { project: true, user: { select: { name: true } } },
  });

  if (!report) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const userId = (session.user as any).id;
  const role = (session.user as any).role;

  if (role === "TEAM_MEMBER" && report.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(report);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as any).id;

  const existing = await prisma.weeklyReport.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();

    const report = await prisma.weeklyReport.update({
      where: { id },
      data: {
        projectId: body.projectId || existing.projectId,
        tasksCompleted: body.tasksCompleted || existing.tasksCompleted,
        tasksPlannedNextWeek:
          body.tasksPlannedNextWeek || existing.tasksPlannedNextWeek,
        blockersChallenges:
          body.blockersChallenges !== undefined
            ? body.blockersChallenges || null
            : existing.blockersChallenges,
        hoursWorked:
          body.hoursWorked !== undefined
            ? body.hoursWorked || null
            : existing.hoursWorked,
        notesLinks:
          body.notesLinks !== undefined
            ? body.notesLinks || null
            : existing.notesLinks,
        workStatus: body.workStatus || existing.workStatus,
        reportStatus: body.reportStatus || existing.reportStatus,
        submittedAt:
          body.reportStatus === "SUBMITTED" && !existing.submittedAt
            ? new Date()
            : existing.submittedAt,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const userId = (session.user as any).id;

  const existing = await prisma.weeklyReport.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.weeklyReport.delete({ where: { id } });

  return NextResponse.json({ message: "Deleted" });
}
