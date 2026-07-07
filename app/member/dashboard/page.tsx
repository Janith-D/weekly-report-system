import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ReportCard } from "@/components/reports/ReportCard";
import { PlusCircle, FileText, Clock, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function MemberDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const reports = await prisma.weeklyReport.findMany({
    where: { userId },
    include: { project: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalReports = await prisma.weeklyReport.count({ where: { userId } });
  const draftReports = await prisma.weeklyReport.count({
    where: { userId, reportStatus: "DRAFT" },
  });
  const submittedReports = await prisma.weeklyReport.count({
    where: { userId, reportStatus: "SUBMITTED" },
  });
  const blockedReports = await prisma.weeklyReport.count({
    where: { userId, workStatus: "BLOCKED" },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome back, {session.user.name}
            </p>
          </div>
          <Link
            href="/member/reports/new"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all"
          >
            <PlusCircle className="w-4 h-4" /> New Report
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalReports}
                </p>
                <p className="text-xs text-gray-500">Total Reports</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-green-50 p-2.5 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {submittedReports}
                </p>
                <p className="text-xs text-gray-500">Submitted</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-50 p-2.5 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {draftReports}
                </p>
                <p className="text-xs text-gray-500">Drafts</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2.5 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {blockedReports}
                </p>
                <p className="text-xs text-gray-500">Blocked</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Reports
            </h2>
            <Link
              href="/member/reports"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </Link>
          </div>
          {reports.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">
                No reports yet. Create your first weekly report!
              </p>
              <Link
                href="/member/reports/new"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" /> Create Report
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={{
                    ...report,
                    weekStartDate: report.weekStartDate.toISOString(),
                    weekEndDate: report.weekEndDate.toISOString(),
                    submittedAt: report.submittedAt?.toISOString() || null,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
