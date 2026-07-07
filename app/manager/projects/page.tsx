import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectsClient } from "./client";

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const role = (session.user as any).role;
  if (role !== "MANAGER" && role !== "ADMIN") redirect("/login");

  const projects = await prisma.project.findMany({
    include: {
      _count: { select: { reports: true, members: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const members = await prisma.user.findMany({
    where: { role: "TEAM_MEMBER" },
    select: { id: true, name: true },
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Project / Category Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage projects and categories for weekly reports
          </p>
        </div>
        <ProjectsClient
          projects={projects.map((p) => ({
            ...p,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
          }))}
          members={members}
        />
      </div>
    </DashboardLayout>
  );
}
