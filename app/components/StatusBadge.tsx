// app\components\StatusBadge.tsx
"use client";

export default function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    OPEN: { color: "bg-red-100 text-red-600", label: "Open" },
    ACKNOWLEDGED: { color: "bg-yellow-100 text-yellow-600", label: "Acknowledged" },
    IN_PROGRESS: { color: "bg-blue-100 text-blue-600", label: "In Progress" },
    CLOSED_REQUESTED: { color: "bg-purple-100 text-purple-600", label: "Close Requested" },
    CLOSED: { color: "bg-green-100 text-green-600", label: "Closed" },
  };

  const config = statusConfig[status] || { color: "bg-gray-100 text-gray-600", label: status };

  return (
    <span className={`px-2 py-0.5 rounded ${config.color}`}>
      {config.label}
    </span>
  );
}
