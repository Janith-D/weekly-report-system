import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ManagerReportsClient } from "./client";

export default async function ManagerReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  if (role !== "MANAGER" && role !== "ADMIN") redirect("/login");

  const reports = await prisma.weeklyReport.findMany({
    include: {
      user: { select: { id: true, name: true } },
      project: { select: { id: true, name: true } },
    },
    orderBy: { weekStartDate: "desc" },
  });

  const teamMembers = await prisma.user.findMany({
    where: { role: "TEAM_MEMBER" },
    select: { id: true, name: true },
  });

  const projects = await prisma.project.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
  });

  const serialized = reports.map((r) => ({
    ...r,
    weekStartDate: r.weekStartDate.toISOString(),
    weekEndDate: r.weekEndDate.toISOString(),
    submittedAt: r.submittedAt?.toISOString() || null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Reports</h1>
          <p className="text-gray-500 mt-1">
            View and manage all team reports
          </p>
        </div>
        <ManagerReportsClient
          reports={serialized}
          teamMembers={teamMembers}
          projects={projects}
        />
      </div>
    </DashboardLayout>
  );
}
