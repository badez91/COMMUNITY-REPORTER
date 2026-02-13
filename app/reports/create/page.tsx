"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateReportForm {
  title: string;
  description: string;
  category: string;
}

export default function CreateReportPage() {
  const [form, setForm] = useState<CreateReportForm>({
    title: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof CreateReportForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) {
      alert("Title, description, and category are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to create report");
      const report = await res.json();
      router.push(`/reports/${report.id}`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error creating report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Create Report</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <input
          placeholder="Category"
          className="w-full p-2 border rounded"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Report"}
        </button>
      </form>
    </div>
  );
}
