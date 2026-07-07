import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Link from "next/link";
import {
  PlusCircle,
  FileText,
  Calendar,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default async function MemberReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const reports = await prisma.weeklyReport.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { weekStartDate: "desc" },
  });

  const groupedByWeek = reports.reduce(
    (acc: Record<string, typeof reports>, report) => {
      const key = `${report.weekStartDate.toISOString().split("T")[0]}_${report.weekEndDate.toISOString().split("T")[0]}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(report);
      return acc;
    },
    {}
  );

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SUBMITTED: "bg-green-100 text-green-700",
    LATE: "bg-red-100 text-red-700",
  };

  const workStatusColors: Record<string, string> = {
    ON_TRACK: "text-green-600",
    AT_RISK: "text-yellow-600",
    BLOCKED: "text-red-600",
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Report History
            </h1>
            <p className="text-gray-500 mt-1">
              View and manage your weekly reports
            </p>
          </div>
          <Link
            href="/member/reports/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <PlusCircle className="w-4 h-4" /> New Report
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No reports yet.</p>
            <Link
              href="/member/reports/new"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
            >
              <PlusCircle className="w-4 h-4" /> Create Your First Report
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByWeek).map(([weekKey, weekReports]) => {
              const [startStr] = weekKey.split("_");
              const start = new Date(startStr);
              const weekLabel = start.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              });
              const endLabel = new Date(
                weekReports[0].weekEndDate
              ).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              });

              return (
                <div key={weekKey}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <h2 className="text-lg font-semibold text-gray-900">
                      Week: {weekLabel} - {endLabel}
                    </h2>
                    <span className="text-xs text-gray-400">
                      ({weekReports.length} report
                      {weekReports.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Project
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Work Status
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Hours
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {weekReports.map((report) => (
                          <tr
                            key={report.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {report.project.name}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                  statusColors[report.reportStatus]
                                }`}
                              >
                                {report.reportStatus}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`inline-flex items-center gap-1 font-medium ${
                                  workStatusColors[report.workStatus]
                                }`}
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {report.workStatus.replace("_", " ")}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                {report.hoursWorked || "-"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <div className="flex items-center gap-3">
                                <Link
                                  href={`/member/reports/${report.id}`}
                                  className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  View
                                </Link>
                                {report.reportStatus !== "SUBMITTED" && (
                                  <Link
                                    href={`/member/reports/${report.id}/edit`}
                                    className="text-gray-600 hover:text-gray-800 font-medium"
                                  >
                                    Edit
                                  </Link>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
