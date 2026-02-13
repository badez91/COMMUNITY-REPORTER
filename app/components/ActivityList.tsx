import { Activity } from "@prisma/client";

type Props = {
  activities: Activity[];
};

export default function ActivityList({ activities }: Props) {
  if (!activities || activities.length === 0) {
    return <p className="text-gray-500">No activity yet.</p>;
  }

  // Helper to assign color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case "REPORT_CREATED":
        return "bg-blue-100 text-blue-800";
      case "REPORT_FOLLOWED":
        return "bg-yellow-100 text-yellow-800";
      case "REPORT_UNFOLLOWED":
        return "bg-orange-100 text-orange-800";
      case "REPORT_CLOSED":
        return "bg-green-100 text-green-800";
      case "CONFIRM_CLOSE":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-2 border-t pt-2">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className={`text-sm px-2 py-1 rounded ${getActivityColor(activity.type)}`}
        >
          <span className="font-medium">{activity.user?.name || activity.userId}</span>: {activity.message}{" "}
          <span className="text-gray-400 text-xs">
            ({new Date(activity.createdAt).toLocaleString()})
          </span>
        </div>
      ))}
    </div>
  );
}
