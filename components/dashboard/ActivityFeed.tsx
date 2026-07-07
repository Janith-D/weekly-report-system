import { Clock, FileText, AlertTriangle, UserPlus, FolderPlus } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  description: string;
  user: { name: string };
  createdAt: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getIcon = (action: string) => {
    switch (action) {
      case "REPORT_SUBMITTED":
        return <FileText className="w-4 h-4 text-blue-500" />;
      case "BLOCKER_REPORTED":
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case "USER_REGISTERED":
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case "PROJECT_CREATED":
        return <FolderPlus className="w-4 h-4 text-purple-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-gray-500 text-sm">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        Recent Activity
      </h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-0.5">{getIcon(activity.action)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">{activity.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-400">
                  {activity.user.name}
                </span>
                <span className="text-gray-300">·</span>
                <span className="text-xs text-gray-400">
                  {new Date(activity.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
