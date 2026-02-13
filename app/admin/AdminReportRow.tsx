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
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2">{report.title}</td>
      <td>{report.creator.name}</td>
      <td>{report.flagged || 0}</td>
      <td>{hidden ? "Yes" : "No"}</td>
      <td className="flex gap-2">
        <button
          onClick={toggleHide}
          disabled={loading}
          className={`px-2 py-1 rounded text-white ${
            hidden ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {hidden ? "Unhide" : "Hide"}
        </button>
        <button
          onClick={banUser}
          disabled={loading}
          className="px-2 py-1 bg-black text-white rounded"
        >
          {banned ? "Banned" : "Ban User"}
        </button>
      </td>
    </tr>
  );
}
