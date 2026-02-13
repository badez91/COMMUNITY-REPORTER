"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateReportForm {
  title: string;
  description: string;
  category: string;
  photoUrl?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
}

export default function CreateReportPage() {
  const [form, setForm] = useState<CreateReportForm>({
    title: "",
    description: "",
    category: "",
  });
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const router = useRouter();

  const handleChange = (field: keyof CreateReportForm, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm({
          ...form,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setGettingLocation(false);
      },
      (error) => {
        alert("Unable to get location: " + error.message);
        setGettingLocation(false);
      }
    );
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
        headers: { "Content-Type": "application/json" },
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
          rows={4}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        <input
          placeholder="Category (e.g., Road, Lighting, Cleanliness)"
          className="w-full p-2 border rounded"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
        
        {/* Optional: Photo URL */}
        <div>
          <label className="block text-sm font-medium mb-1">Photo URL (Optional)</label>
          <input
            placeholder="https://example.com/photo.jpg"
            className="w-full p-2 border rounded"
            value={form.photoUrl || ""}
            onChange={(e) => handleChange("photoUrl", e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">Paste a photo URL from any image hosting service</p>
        </div>

        {/* Optional: Location */}
        <div>
          <label className="block text-sm font-medium mb-1">Location (Optional)</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={getLocation}
              disabled={gettingLocation}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
            >
              {gettingLocation ? "Getting..." : "📍 Get My Location"}
            </button>
            {form.latitude && form.longitude && (
              <span className="text-sm text-green-600 flex items-center">
                ✓ Location captured
              </span>
            )}
          </div>
          <input
            placeholder="Address (optional)"
            className="w-full p-2 border rounded mt-2"
            value={form.address || ""}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Create Report"}
        </button>
      </form>
    </div>
  );
}
