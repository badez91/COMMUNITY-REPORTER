"use client";

import { useState, useEffect } from "react";

export default function UpdateForm({ reportId }: { reportId: string }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  // Countdown effect
  useEffect(() => {
    if (!retryAfter) return;

    const interval = setInterval(() => {
      setRetryAfter((prev) => {
        if (!prev || prev <= 1) {
          clearInterval(interval);
          setError(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [retryAfter]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    const res = await fetch(`/api/reports/${reportId}/updates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();

    if (!res.ok) {
      if (res.status === 429) {
        setError(data.error || "Too many requests");
        setRetryAfter(data.retryAfter || 5);
      } else {
        setError(data.error || "Failed to post update");
      }
      setLoading(false);
      return;
    }

    setMessage("");
    setLoading(false);
    location.reload();
  }

  return (
    <form onSubmit={submit} className="mt-4 space-y-2">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Post an update..."
        className="w-full border p-2 rounded-lg"
        disabled={loading || retryAfter !== null}
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {error}
          {retryAfter && (
            <span className="ml-1 text-gray-600">
              Try again in {retryAfter}s
            </span>
          )}
        </div>
      )}

      <button
        disabled={loading || retryAfter !== null}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading
          ? "Posting..."
          : retryAfter
          ? `Wait ${retryAfter}s`
          : "Post Update"}
      </button>
    </form>
  );
}
