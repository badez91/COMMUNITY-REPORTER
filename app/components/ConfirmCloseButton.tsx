"use client";

import { useState } from "react";

export default function ConfirmCloseButton({ reportId }: { reportId: string }) {
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);

    await fetch(`/api/reports/${reportId}/confirm`, {
      method: "POST",
    });

    setLoading(false);
    location.reload();
  }

  return (
    <button
      onClick={confirm}
      disabled={loading}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
    >
      ✅ Confirm Resolved
    </button>
  );
}
