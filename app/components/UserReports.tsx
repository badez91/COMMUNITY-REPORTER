// app/components/UserReports.tsx
"use client";

import { useEffect, useState } from "react";
import ReportCard from "@/app/components/ReportCard";

export default function UserReports({ userId }: { userId: string }) {
  const [reports, setReports] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const statusQuery =
      statusFilter !== "ALL" ? `&status=${statusFilter}` : "";

    fetch(
      `/api/users/${userId}/reports?page=${page}&pageSize=${pageSize}${statusQuery}`
    )
      .then((res) => res.json())
      .then((data) => setReports(data.reports));
  }, [userId, page, statusFilter]);

  return (
    <div>
      <h2 className="font-semibold text-lg mb-3">Reports Created</h2>

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["ALL", "OPEN", "ACKNOWLEDGED", "IN_PROGRESS", "CLOSED"].map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s);
              setPage(1);
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              statusFilter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Reports */}
      {reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No reports found</p>
      )}

      {/* Pagination */}
      {reports.length === pageSize && (
        <div className="flex justify-between mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <button
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
