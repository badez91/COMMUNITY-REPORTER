"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";

export default function FollowButton({ reportId }: { reportId: string }) {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);

  console.log("Follow reportId : " + reportId)
  async function follow() {
    if (!session?.user?.email) {
      // Prompt login
      signIn("google");
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/reports/${reportId}/follow`, {
      method: "POST",
    });

    if (!res.ok) {
      alert("Failed to follow report");
    }
    setLoading(false);
    location.reload();
    await update();
  }

  return (
    <button
      onClick={follow}
      disabled={loading}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Follow
    </button>
  );
}
