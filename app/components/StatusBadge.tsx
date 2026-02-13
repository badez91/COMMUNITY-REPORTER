// app\components\StatusBadge.tsx
"use client";

export default function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    OPEN: "bg-red-100 text-red-600",
    ACKNOWLEDGED: "bg-yellow-100 text-yellow-600",
    IN_PROGRESS: "bg-blue-100 text-blue-600",
    CLOSED: "bg-green-100 text-green-600",
  };

  return (
    <span className={`px-2 py-0.5 rounded ${colors[status]}`}>
      {status}
    </span>
  );
}
