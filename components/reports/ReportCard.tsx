import Link from "next/link";
import { Eye, Edit, Calendar, Clock, AlertTriangle } from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    weekStartDate: string;
    weekEndDate: string;
    project: { name: string };
    tasksCompleted: string;
    blockersChallenges: string | null;
    hoursWorked: number | null;
    workStatus: string;
    reportStatus: string;
    submittedAt: string | null;
  };
  showMember?: boolean;
  memberName?: string;
}

export function ReportCard({ report, showMember, memberName }: ReportCardProps) {
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

  const startDate = new Date(report.weekStartDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endDate = new Date(report.weekEndDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {startDate} - {endDate}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">
              {report.project.name}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                statusColors[report.reportStatus] || "bg-gray-100 text-gray-700"
              }`}
            >
              {report.reportStatus}
            </span>
          </div>
        </div>

        {showMember && memberName && (
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Member:</span> {memberName}
          </p>
        )}

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {report.tasksCompleted}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${
              workStatusColors[report.workStatus]
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            {report.workStatus.replace("_", " ")}
          </span>
          {report.hoursWorked !== null && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {report.hoursWorked}h
            </span>
          )}
          {report.blockersChallenges && report.blockersChallenges.trim().length > 0 && (
            <span className="text-red-500 font-medium">Has blockers</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/member/reports/${report.id}`}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> View
          </Link>
          {report.reportStatus !== "SUBMITTED" && (
            <Link
              href={`/member/reports/${report.id}/edit`}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" /> Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
