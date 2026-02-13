// app/components/ReportStatusUpdater.tsx
"use client";

import { useState } from "react";
import { ReportStatus } from "@prisma/client";

interface Props {
  reportId: string;
  currentStatus: ReportStatus;
  isEditable?: boolean; // optional: disable for non-creators
}

const statusOptions: ReportStatus[] = ["OPEN", "ACKNOWLEDGED", "IN_PROGRESS", "CLOSED"];

const statusColor: Record<ReportStatus, string> = {
  OPEN: "bg-yellow-100 text-yellow-800",
  ACKNOWLEDGED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-purple-100 text-purple-800",  
  CLOSED_REQUESTED: "bg-gray-100 text-green-800",
  CLOSED: "bg-green-100 text-green-800",
};

export default function ReportStatusUpdater({
  reportId,
  currentStatus,
  isEditable = true,
}: Props) {
  const [status, setStatus] = useState<ReportStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const newStatus = e.target.value as ReportStatus;
  if (newStatus === status) return;

  setStatus(newStatus); // optimistic UI
  setLoading(true);

  console.log("reportID : " + reportId);
  try {
    const res = await fetch(`/api/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      let data: any = {};
      try {
        data = await res.json(); // safe parse
      } catch {
        // ignore parse errors
      }
      alert(data?.error || "Failed to update status");
      setStatus(currentStatus); // rollback
    }
    } catch (err) {
        console.error(err);
        setStatus(currentStatus); // rollback
        alert("Failed to update status due to network error");
    } finally {
        setLoading(false);
    }
};


  return isEditable ? (
    <select
      className={`px-3 py-1 rounded text-sm font-medium ${statusColor[status]} ${
        loading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      value={status}
      onChange={handleChange}
      disabled={loading}
    >
      {statusOptions.map((s) => (
        <option key={s} value={s}>
          {s.replace("_", " ")}
        </option>
      ))}
    </select>
  ) : (
    <span className={`px-3 py-1 rounded text-sm font-medium ${statusColor[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
}
