import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { WeeklyReportForm } from "@/components/reports/WeeklyReportForm";

export default async function EditReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const report = await prisma.weeklyReport.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!report) notFound();

  const userId = (session.user as any).id;
  if (report.userId !== userId) redirect("/login");
  if (report.reportStatus === "SUBMITTED") redirect(`/member/reports/${id}`);

  const initialData = {
    id: report.id,
    weekStartDate: report.weekStartDate.toISOString().split("T")[0],
    weekEndDate: report.weekEndDate.toISOString().split("T")[0],
    projectId: report.projectId,
    tasksCompleted: report.tasksCompleted,
    tasksPlannedNextWeek: report.tasksPlannedNextWeek,
    blockersChallenges: report.blockersChallenges || "",
    hoursWorked: report.hoursWorked || 0,
    notesLinks: report.notesLinks || "",
    workStatus: report.workStatus,
    reportStatus: report.reportStatus,
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Report</h1>
          <p className="text-gray-500 mt-1">
            Update your weekly report for{" "}
            {new Date(report.weekStartDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}{" "}
            -{" "}
            {new Date(report.weekEndDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <WeeklyReportForm initialData={initialData} isEditing />
      </div>
    </DashboardLayout>
  );
}
