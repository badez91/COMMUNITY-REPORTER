"use client";

import { useState } from "react";
import BadgeItem from "./BadgeItem";

export default function EditProfileForm({ user }: any) {
  const [name, setName] = useState(user.name || "");
  const [image, setImage] = useState(user.image || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image }),
    });

    if (!res.ok) {
      alert("Failed to update");
    } else {
      alert("Profile updated");
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded-lg space-y-3"
    >
      <div className="flex items-center gap-4">
        <img
          src={image || "/avatar.png"}
          className="w-20 h-20 rounded-full"
        />

        <div className="flex-1 space-y-2">
          <div>
            <label className="text-sm">Name</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Avatar URL</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>

      <div className="text-yellow-600 font-medium">
        ⭐ Points: {user.points}
      </div>

      <div className="flex flex-wrap gap-3">
        {user.badges.map((ub: any) => (
          <BadgeItem
            key={ub.id}
            name={ub.badge.name}
            icon={ub.badge.icon}
          />
        ))}
      </div>
    </form>
  );
}
