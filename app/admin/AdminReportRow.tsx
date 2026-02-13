"use client";

import { useState } from "react";

interface Props {
  report: any; // include id, title, flagged, isHidden, creator
}

export default function AdminReportRow({ report }: Props) {
  const [hidden, setHidden] = useState(report.isHidden);
  const [banned, setBanned] = useState(report.creator.isBanned);
  const [loading, setLoading] = useState(false);

  const toggleHide = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}/hide`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hide: !hidden }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setHidden(!hidden);
    } catch (err) {
      console.error(err);
      alert("Failed to update hidden status");
    } finally {
      setLoading(false);
    }
  };

  const banUser = async () => {
    if (!confirm(`Ban user ${report.creator.name}?`)) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${report.creator.id}/ban`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ban: !banned }),
      });
      if (!res.ok) throw new Error("Failed to ban");
      setBanned(true);
      alert("User banned");
    } catch (err) {
      console.error(err);
      alert("Failed to ban user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr className="border-b hover:bg-purple-50 transition">
      <td className="p-3">{report.title}</td>
      <td className="p-3">{report.creator.name}</td>
      <td className="p-3 text-center">{report.flagged || 0}</td>
      <td className="p-3 text-center">{hidden ? "Yes" : "No"}</td>
      <td className="p-3">
        <div className="flex gap-2 justify-center">
          <button
            onClick={toggleHide}
            disabled={loading}
            className={`px-3 py-1 rounded-lg text-white transition ${
              hidden ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {hidden ? "Unhide" : "Hide"}
          </button>
          <button
            onClick={banUser}
            disabled={loading}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition"
          >
            {banned ? "Banned" : "Ban User"}
          </button>
        </div>
      </td>
    </tr>
  );
}
