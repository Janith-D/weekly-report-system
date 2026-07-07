import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Link from "next/link";
import {
  Calendar,
  Clock,
  AlertTriangle,
  ArrowLeft,
  FileText,
  MessageSquare,
} from "lucide-react";

export default async function ManagerReportViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const report = await prisma.weeklyReport.findUnique({
    where: { id },
    include: { project: true, user: true, comments: { include: { author: { select: { name: true } } } } },
  });

  if (!report) notFound();

  const role = (session.user as any).role;
  if (role !== "MANAGER" && role !== "ADMIN") redirect("/login");

  const statusColors: Record<string, string> = {
    DRAFT: "bg-gray-100 text-gray-700",
    SUBMITTED: "bg-green-100 text-green-700",
    LATE: "bg-red-100 text-red-700",
  };

  const workStatusColors: Record<string, string> = {
    ON_TRACK: "text-green-600 bg-green-50",
    AT_RISK: "text-yellow-600 bg-yellow-50",
    BLOCKED: "text-red-600 bg-red-50",
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/manager/reports"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to reports
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(report.weekStartDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(report.weekEndDate).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  {report.project.name}
                </h1>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  statusColors[report.reportStatus]
                }`}
              >
                {report.reportStatus}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <FileText className="w-4 h-4" />
              <span>
                Reported by <strong>{report.user.name}</strong>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${
                  workStatusColors[report.workStatus]
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                {report.workStatus.replace("_", " ")}
              </span>
              {report.hoursWorked !== null && (
                <span className="flex items-center gap-1.5 text-gray-600">
                  <Clock className="w-4 h-4" /> {report.hoursWorked} hours
                </span>
              )}
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            <Section title="Tasks Completed" content={report.tasksCompleted} />
            <Section
              title="Tasks Planned for Next Week"
              content={report.tasksPlannedNextWeek}
            />
            {report.blockersChallenges && (
              <Section
                title="Blockers / Challenges"
                content={report.blockersChallenges}
              />
            )}
            {report.notesLinks && (
              <Section title="Notes / Links" content={report.notesLinks} />
            )}
          </div>

          <div className="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-4">
            <span>Created: {new Date(report.createdAt).toLocaleString()}</span>
            <span>Updated: {new Date(report.updatedAt).toLocaleString()}</span>
            {report.submittedAt && (
              <span>
                Submitted: {new Date(report.submittedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Comments ({report.comments.length})
            </h3>
          </div>

          {report.comments.length === 0 ? (
            <p className="text-sm text-gray-500">No comments yet.</p>
          ) : (
            <div className="space-y-4">
              {report.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-gray-50 rounded-xl p-4"
                >
                  <p className="text-sm text-gray-700">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {comment.author.name} ·{" "}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function Section({ title, content }: { title: string; content: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">{title}</h3>
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
