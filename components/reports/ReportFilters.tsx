"use client";

import { Search, Filter, X } from "lucide-react";

interface ReportFiltersProps {
  teamMembers: { id: string; name: string }[];
  projects: { id: string; name: string }[];
  filters: {
    memberId: string;
    projectId: string;
    weekStart: string;
    weekEnd: string;
    status: string;
    workStatus: string;
  };
  setFilters: (filters: any) => void;
}

export function ReportFilters({
  teamMembers,
  projects,
  filters,
  setFilters,
}: ReportFiltersProps) {
  const clearFilters = () => {
    setFilters({
      memberId: "",
      projectId: "",
      weekStart: "",
      weekEnd: "",
      status: "",
      workStatus: "",
    });
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Member</label>
          <select
            value={filters.memberId}
            onChange={(e) =>
              setFilters({ ...filters, memberId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All members</option>
            {teamMembers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Project</label>
          <select
            value={filters.projectId}
            onChange={(e) =>
              setFilters({ ...filters, projectId: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Week From</label>
          <input
            type="date"
            value={filters.weekStart}
            onChange={(e) =>
              setFilters({ ...filters, weekStart: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Week To</label>
          <input
            type="date"
            value={filters.weekEnd}
            onChange={(e) =>
              setFilters({ ...filters, weekEnd: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Submission Status
          </label>
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="LATE">Late</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">
            Work Status
          </label>
          <select
            value={filters.workStatus}
            onChange={(e) =>
              setFilters({ ...filters, workStatus: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="ON_TRACK">On Track</option>
            <option value="AT_RISK">At Risk</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>
    </div>
  );
}
