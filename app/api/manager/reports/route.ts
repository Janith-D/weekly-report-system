import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const role = (session.user as any).role;
  if (role !== "MANAGER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  const projectId = searchParams.get("projectId");
  const weekStart = searchParams.get("weekStart");
  const weekEnd = searchParams.get("weekEnd");
  const status = searchParams.get("status");

  const where: any = {};

  if (memberId) where.userId = memberId;
  if (projectId) where.projectId = projectId;
  if (weekStart) where.weekStartDate = { gte: new Date(weekStart) };
  if (weekEnd) where.weekEndDate = { lte: new Date(weekEnd) };
  if (status) where.reportStatus = status;

  const reports = await prisma.weeklyReport.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
    orderBy: { weekStartDate: "desc" },
  });

  return NextResponse.json(reports);
}
