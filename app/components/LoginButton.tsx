"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || "avatar"}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span>{session.user.name}</span>
        <button
          onClick={() => signOut()}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Sign In with Google
    </button>
  );
}
