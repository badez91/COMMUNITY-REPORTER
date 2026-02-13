"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { FaHome, FaPlus, FaSignOutAlt, FaUser } from "react-icons/fa";

export default function Navbar() {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between sticky top-0 z-50">
      
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <Link href="/" className="font-bold text-xl">
          🌐 Community Reporter
        </Link>

        {/* Mobile Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-2 md:hidden p-1 rounded hover:bg-gray-100"
        >
          {collapsed ? "☰" : "✕"}
        </button>
      </div>

      {/* Middle: Navigation */}
      <div
        className={`flex items-center gap-6 transition-all duration-300 ${
          collapsed ? "hidden md:flex" : "flex"
        }`}
      >
        {session ? (
          <>
            <Link href="/" className="flex items-center gap-1 group">
              <FaHome className="text-gray-700 group-hover:text-blue-600" />
              <span className="hidden md:inline">Home</span>
            </Link>

            <Link href="/reports/create" className="flex items-center gap-1 group">
              <FaPlus className="text-gray-700 group-hover:text-green-600" />
              <span className="hidden md:inline">Create</span>
            </Link>

            <Link href="/profile" className="flex items-center gap-1 group">
              <FaUser className="text-gray-700 group-hover:text-purple-600" />
              <span className="hidden md:inline">Profile</span>
            </Link>
            <div className="text-sm text-gray-600">
            ⭐ {session.user?.points ?? 0}
          </div>
          </>
        ) : null}
      </div>

      {/* Right: User Section */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <Link
              href="/profile"
              className="flex items-center gap-2 font-medium text-gray-700 hover:text-blue-600 transition"
            >
              {session.user?.image && (
                <img
                  src={session.user.image}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="hidden md:inline">
                {session.user?.name}
              </span>
            </Link>

            {session.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
              >
                Admin
              </Link>
            )}

            <button
              onClick={() => signOut()}
              className="text-gray-500 hover:text-red-600 transition text-xl"
              title="Logout"
            >
              <FaSignOutAlt className="text-red-700 group-hover:text-red-600" />
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}