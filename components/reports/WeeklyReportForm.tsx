"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Send, X } from "lucide-react";

interface Project {
  id: string;
  name: string;
}

interface ReportFormData {
  weekStartDate: string;
  weekEndDate: string;
  projectId: string;
  tasksCompleted: string;
  tasksPlannedNextWeek: string;
  blockersChallenges: string;
  hoursWorked: number;
  notesLinks: string;
  workStatus: "ON_TRACK" | "AT_RISK" | "BLOCKED";
}

interface WeeklyReportFormProps {
  initialData?: ReportFormData & { id?: string; reportStatus?: string };
  isEditing?: boolean;
}

export function WeeklyReportForm({
  initialData,
  isEditing,
}: WeeklyReportFormProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ReportFormData>(
    initialData || {
      weekStartDate: "",
      weekEndDate: "",
      projectId: "",
      tasksCompleted: "",
      tasksPlannedNextWeek: "",
      blockersChallenges: "",
      hoursWorked: 0,
      notesLinks: "",
      workStatus: "ON_TRACK",
    }
  );

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.filter((p: Project) => p.name)))
      .catch(() => setError("Failed to load projects"));
  }, []);

  async function handleSubmit(action: "DRAFT" | "SUBMITTED") {
    setError("");
    setLoading(true);

    if (!form.weekStartDate || !form.weekEndDate) {
      setError("Week dates are required");
      setLoading(false);
      return;
    }
    if (!form.projectId) {
      setError("Project/category is required");
      setLoading(false);
      return;
    }
    if (form.tasksCompleted.length < 10) {
      setError("Tasks completed must be at least 10 characters");
      setLoading(false);
      return;
    }
    if (form.tasksPlannedNextWeek.length < 10) {
      setError("Planned tasks must be at least 10 characters");
      setLoading(false);
      return;
    }

    const url = isEditing
      ? `/api/reports/${initialData?.id}`
      : "/api/reports";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, reportStatus: action }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save report");
        setLoading(false);
        return;
      }

      router.push("/member/reports");
      router.refresh();
    } catch {
      setError("An error occurred");
      setLoading(false);
    }
  }

  const fields = [
    {
      key: "weekStartDate",
      label: "Week Start Date",
      type: "date",
    },
    {
      key: "weekEndDate",
      label: "Week End Date",
      type: "date",
    },
    {
      key: "projectId",
      label: "Project / Category",
      type: "select",
      options: projects,
    },
    {
      key: "tasksCompleted",
      label: "Tasks Completed",
      type: "textarea",
      placeholder: "Describe the tasks you completed this week...",
    },
    {
      key: "tasksPlannedNextWeek",
      label: "Tasks Planned for Next Week",
      type: "textarea",
      placeholder: "Describe the tasks planned for next week...",
    },
    {
      key: "blockersChallenges",
      label: "Blockers / Challenges",
      type: "textarea",
      placeholder: "Any blockers or challenges (optional)...",
    },
    {
      key: "hoursWorked",
      label: "Hours Worked",
      type: "number",
    },
    {
      key: "notesLinks",
      label: "Notes or Links",
      type: "text",
      placeholder: "Optional notes or links...",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {fields.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  value={form[field.key as keyof ReportFormData] as string}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
                  placeholder={field.placeholder}
                />
              ) : field.type === "select" ? (
                <select
                  value={form.projectId}
                  onChange={(e) =>
                    setForm({ ...form, projectId: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select project...</option>
                  {field.options?.map((opt: Project) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              ) : field.type === "number" ? (
                <input
                  type="number"
                  value={form.hoursWorked}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hoursWorked: parseFloat(e.target.value) || 0,
                    })
                  }
                  min={0}
                  step={0.5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <input
                  type={field.type}
                  value={form[field.key as keyof ReportFormData] as string}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Work Status
            </label>
            <div className="flex gap-3">
              {(["ON_TRACK", "AT_RISK", "BLOCKED"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setForm({ ...form, workStatus: status })}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all border ${
                    form.workStatus === status
                      ? status === "ON_TRACK"
                        ? "bg-green-50 border-green-300 text-green-700"
                        : status === "AT_RISK"
                          ? "bg-yellow-50 border-yellow-300 text-yellow-700"
                          : "bg-red-50 border-red-300 text-red-700"
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 sm:px-8 py-5 bg-gray-50 rounded-b-2xl border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
          >
            <X className="w-4 h-4" /> Cancel
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSubmit("DRAFT")}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save as Draft
            </button>
            <button
              onClick={() => handleSubmit("SUBMITTED")}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl text-sm font-medium transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Submit Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
