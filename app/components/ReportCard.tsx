"use client";

import { useState } from "react";
import Link from "next/link";
import { ReportStatus } from "@prisma/client";
import StatusBadge from "./StatusBadge";

interface Report {
  creator?: any;
  id: string;
  title: string;
  description: string;
  status: ReportStatus;
  category: string;
  isFollowing?: boolean;
  createdAt?: string;
}

interface Props {
  report: Report;
  onActionComplete?: () => void;
}

export default function ReportCard({ report, onActionComplete }: Props) {
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    report.isFollowing ?? false
  );
  const [flagLoading, setFlagLoading] = useState(false);

  const toggleFollow = async () => {
    setLoading(true);
    try {
      const method = isFollowing ? "DELETE" : "POST";
      const res = await fetch(`/api/reports/${report.id}/follow`, {
        method,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed");
      } else {
        setIsFollowing(!isFollowing);
        onActionComplete?.();
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred");
    } finally {
      setLoading(false);
    }
  };
  const handleFlag = async () => {
    setFlagLoading(true);
    try {
      const res = await fetch(`/api/reports/${report.id}/flag`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data?.error || "Failed to flag report");
      } else {
        alert("Report flagged for review");
      }
    } catch (err) {
      alert("Error flagging report");
    } finally {
      setFlagLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition space-y-4">

      {/* ===== TITLE SECTION (NO BORDER) ===== */}
      <div>
        <Link href={`/reports/${report.id}`}>
          <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition">
            {report.title}
          </h2>
        </Link>

        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
          <span className="px-2 py-0.5 bg-gray-200 rounded">
            {report.category}
          </span>

          <StatusBadge status={report.status} />
        </div>
      </div>

      {/* ===== DESCRIPTION (LIGHT BORDER) ===== */}
      <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
        <p className="text-sm text-gray-700 leading-relaxed line-clamp-4">
          {report.description}
        </p>
      </div>

      {/* ===== CREATOR + DATE ===== */}
      <div className="border-t border-gray-200 pt-3 flex justify-between text-sm text-gray-600">
        <div>
          {report.creator && (
            <Link
              href={`/users/${report.creator.id}`}
              className="hover:text-blue-600 transition"
            >
              👤 {report.creator.name || "Anonymous"}
            </Link>
          )}
        </div>

        <div>
          {report.createdAt &&
            new Date(report.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* ===== ACTION ROW ===== */}
      <div className="flex justify-between items-center mt-5 border-t pt-3">
        <div className="flex gap-3 items-center">
          <Link
            href={`/reports/${report.id}`}
            className="text-blue-600 text-sm hover:underline"
          >
            View Details →
          </Link>

          <button
            onClick={handleFlag}
            disabled={flagLoading}
            className="text-xs text-red-500 hover:text-red-700 transition"
            title="Flag inappropriate content"
          >
            ⚠ Flag
          </button>
        </div>

        <button
          onClick={toggleFollow}
          disabled={loading}
          className={`text-sm px-3 py-1 rounded transition ${
            isFollowing
              ? "bg-red-100 hover:bg-red-200 text-red-600"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
        >
          {loading ? "Loading..." : isFollowing ? "Unfollow" : "Follow"}
        </button>
      </div>
    </div>
  );
}
