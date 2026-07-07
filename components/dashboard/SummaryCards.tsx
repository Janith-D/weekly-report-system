import {
  FileText,
  TrendingUp,
  Clock,
  AlertTriangle,
  Users,
  Timer,
} from "lucide-react";

interface SummaryCardsProps {
  metrics: {
    totalSubmitted: number;
    complianceRate: number;
    pendingReports: number;
    lateReports: number;
    openBlockers: number;
    totalHours: number;
  };
}

export function SummaryCards({ metrics }: SummaryCardsProps) {
  const cards = [
    {
      label: "Submitted Reports",
      value: metrics.totalSubmitted,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Compliance Rate",
      value: `${metrics.complianceRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Pending Reports",
      value: metrics.pendingReports,
      icon: Clock,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Late Reports",
      value: metrics.lateReports,
      icon: Timer,
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      label: "Open Blockers",
      value: metrics.openBlockers,
      icon: AlertTriangle,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Total Hours",
      value: metrics.totalHours,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className={`${card.bg} p-2.5 rounded-lg`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
