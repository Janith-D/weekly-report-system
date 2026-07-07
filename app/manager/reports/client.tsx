"use client";

import { useState } from "react";
import { ReportFilters } from "@/components/reports/ReportFilters";
import { ReportTable } from "@/components/reports/ReportTable";

interface Report {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  projectId: string;
  project: { id: string; name: string };
  userId: string;
  user: { id: string; name: string };
  tasksCompleted: string;
  blockersChallenges: string | null;
  hoursWorked: number | null;
  workStatus: string;
  reportStatus: string;
  submittedAt: string | null;
}

interface TeamMember {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
}

interface ManagerReportsClientProps {
  reports: Report[];
  teamMembers: TeamMember[];
  projects: Project[];
}

export function ManagerReportsClient({
  reports,
  teamMembers,
  projects,
}: ManagerReportsClientProps) {
  const [filters, setFilters] = useState({
    memberId: "",
    projectId: "",
    weekStart: "",
    weekEnd: "",
    status: "",
    workStatus: "",
  });

  const filtered = reports.filter((r) => {
    if (filters.memberId && r.userId !== filters.memberId) return false;
    if (filters.projectId && r.projectId !== filters.projectId) return false;
    if (filters.status && r.reportStatus !== filters.status) return false;
    if (filters.workStatus && r.workStatus !== filters.workStatus) return false;
    if (
      filters.weekStart &&
      new Date(r.weekStartDate) < new Date(filters.weekStart)
    )
      return false;
    if (
      filters.weekEnd &&
      new Date(r.weekEndDate) > new Date(filters.weekEnd)
    )
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <ReportFilters
        teamMembers={teamMembers}
        projects={projects}
        filters={filters}
        setFilters={setFilters}
      />
      <ReportTable reports={filtered} />
    </div>
  );
}
