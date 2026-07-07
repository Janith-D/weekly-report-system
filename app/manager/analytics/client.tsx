"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Report {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  user: { name: string };
  project: { name: string };
  tasksCompleted: string;
  blockersChallenges: string | null;
  hoursWorked: number | null;
  workStatus: string;
  reportStatus: string;
}

const COLORS = [
  "#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7",
  "#ec4899", "#14b8a6", "#f97316", "#6366f1", "#84cc16",
];

interface AnalyticsClientProps {
  reports: Report[];
}

export function AnalyticsClient({ reports }: AnalyticsClientProps) {
  const weekData = reports.reduce(
    (acc: Record<string, { week: string; reports: number; hours: number; blockers: number }>, r) => {
      const weekKey = new Date(r.weekStartDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      if (!acc[weekKey])
        acc[weekKey] = { week: weekKey, reports: 0, hours: 0, blockers: 0 };
      acc[weekKey].reports++;
      acc[weekKey].hours += r.hoursWorked || 0;
      if (
        r.blockersChallenges &&
        r.blockersChallenges.trim().length > 0
      )
        acc[weekKey].blockers++;
      return acc;
    },
    {}
  );

  const trendData = Object.values(weekData).sort(
    (a, b) => new Date(a.week).getTime() - new Date(b.week).getTime()
  );

  const hoursData = trendData.map((d) => ({
    week: d.week,
    hours: Math.round(d.hours * 10) / 10,
    blockers: d.blockers,
  }));

  const projectHours = reports.reduce(
    (acc: Record<string, number>, r) => {
      acc[r.project.name] = (acc[r.project.name] || 0) + (r.hoursWorked || 0);
      return acc;
    },
    {}
  );

  const projectHoursData = Object.entries(projectHours)
    .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }))
    .sort((a, b) => b.value - a.value);

  const memberCount = reports.reduce(
    (acc: Record<string, number>, r) => {
      acc[r.user.name] = (acc[r.user.name] || 0) + 1;
      return acc;
    },
    {}
  );

  const memberData = Object.entries(memberCount)
    .map(([name, value]) => ({ name, reports: value }))
    .sort((a, b) => b.reports - a.reports);

  const statusCount = reports.reduce(
    (acc: Record<string, number>, r) => {
      acc[r.workStatus] = (acc[r.workStatus] || 0) + 1;
      return acc;
    },
    {}
  );

  const workStatusData = Object.entries(statusCount).map(([name, value]) => ({
    name: name.replace("_", " "),
    value,
  }));

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Hours Worked Over Time
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="hours"
                  name="Hours"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Blockers Trend
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="blockers"
                  name="Blockers"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: "#ef4444", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Hours by Project
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectHoursData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {projectHoursData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Reports by Team Member
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={memberData}
                layout="vertical"
                barSize={16}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e7eb" }}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="reports"
                  name="Reports"
                  fill="#6366f1"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            Work Status Distribution
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${((percent || 0) * 100).toFixed(0)}%`
                  }
                >
                  {workStatusData.map((_, i) => (
                    <Cell
                      key={`cell-${i}`}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
