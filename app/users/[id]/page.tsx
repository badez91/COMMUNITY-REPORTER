// app/users/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import UserReports from "@/app/components/UserReports";
import ActivityList from "@/app/components/ActivityList";
import BackButton from "@/app/components/BackButton";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      badges: { include: { badge: true } },
      activity: {
        include: { report: true },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!user) return notFound();

  return (
    <div className="space-y-8 p-6 max-w-3xl mx-auto">
      {/* Profile Header */}
      <div className="flex items-center gap-4 bg-white shadow rounded-xl p-4">
        {user.image ? (
          <img
            src={user.image}
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold text-white">
            {user.name?.[0] || "U"}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-yellow-600 font-semibold mt-1">
            ⭐ {user.points} points
          </p>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-lg font-semibold mb-2">🏅 Badges</h2>

        {user.badges?.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {user.badges.map((ub: any) => (
              <div
                key={ub.id}
                className="px-4 py-2 bg-gradient-to-r from-yellow-200 to-yellow-400 text-yellow-900 rounded-full shadow-md text-sm font-semibold"
              >
                {ub.badge.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No badges earned yet.</p>
        )}
      </div>

      {/* Reports (Client Component) */}
      <UserReports userId={id} />

      {/* Activity */}
      <div>
        <h2 className="font-semibold text-lg mb-2">Recent Activity</h2>
        <ActivityList activities={user.activity} />
      </div>
      <BackButton />
    </div>
  );
}
