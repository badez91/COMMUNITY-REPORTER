"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ReportCard from "./components/ReportCard";

export default function HomePage() {
  const { data: session, update: updateSession } = useSession();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const fetchReports = async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (query) params.append("search", query);
    if (status !== "ALL") params.append("status", status);
    if (category !== "ALL") params.append("category", category);
    params.append("page", String(page));
    params.append("pageSize", String(pageSize));

    const res = await fetch(`/api/reports?${params.toString()}`);
    const data = await res.json();

    setReports(data.reports || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, [query, status, category, page]);

  const handleActionComplete = async () => {
    await fetchReports();         // Refresh report follow status
    await updateSession?.();      // Refresh user points
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
     
      {/* Search */}
      <input
        placeholder="Search reports..."
        className="w-full p-3 border rounded-lg shadow-sm"
        value={query}
        onChange={(e) => {
          setPage(1);
          setQuery(e.target.value);
        }}
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {[
          { value: "ALL", label: "All" },
          { value: "OPEN", label: "Open" },
          { value: "ACKNOWLEDGED", label: "Acknowledged" },
          { value: "IN_PROGRESS", label: "In Progress" },
          { value: "CLOSED", label: "Closed" },
        ].map((s) => (
          <button
            key={s.value}
            onClick={() => {
              setPage(1);
              setStatus(s.value);
            }}
            className={`px-3 py-1 rounded-full text-sm transition ${
              status === s.value
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {s.label}
          </button>
        ))}

        {/* {["ALL", "ROAD", "DRAIN", "LIGHTING", "CLEANLINESS"].map((c) => (
          <button
            key={c}
            onClick={() => {
              setPage(1);
              setCategory(c);
            }}
            className={`px-3 py-1 rounded-full text-sm ${
              category === c
                ? "bg-green-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {c}
          </button>
        ))} */}
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading reports...
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No reports found.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onActionComplete={handleActionComplete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {reports.length === pageSize && (
        <div className="flex justify-between pt-6">
          <button
            className="px-3 py-2 bg-gray-200 rounded disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </button>

          <button
            className="px-3 py-2 bg-gray-200 rounded"
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
