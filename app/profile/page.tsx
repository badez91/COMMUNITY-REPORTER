// app/profile/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import StatusBadge from "@/app/components/StatusBadge";
import Link from "next/link";
import FollowButton from "@/app/components/FollowButton";
import EditProfileForm from "../components/EditProfileForm";
import BackButton from "../components/BackButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <p className="text-red-500">You must be logged in to view your profile.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    );
  }

  // Fetch user info
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      badges: { include: { badge: true } },
      reports: { orderBy: { createdAt: "desc" } },
      follows: { include: { report: true } },
    },
  });

  if (!user) return <p>User not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>

      {session.user.role =="ADMIN" && (
        <Link
          href="/admin"
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Admin Dashboard
        </Link>
      )}

      {/* User Info & Edit Form */}
      <EditProfileForm user={user} session={session} />

      {/* My Reports */}
      <UserReports reports={user.reports} />

      {/* Following Reports */}
      <FollowingReports follows={user.follows} />

      <BackButton />
    </div>
  );
}

function UserReports({ reports }: any) {
  if (reports.length === 0)
    return <p className="text-gray-500">You haven't created any reports yet.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">My Reports</h2>
      <div className="space-y-3">
        {reports.map((report: any) => (
          <div
            key={report.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <Link
                href={`/reports/${report.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {report.title}
              </Link>
              <div className="mt-1">
                <StatusBadge status={report.status} />
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(report.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowingReports({ follows }: any) {
  if (follows.length === 0)
    return <p className="text-gray-500">You are not following any reports.</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2">Following Reports</h2>
      <div className="space-y-3">
        {follows.map((follow: any) => (
          <div
            key={follow.report.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <Link
                href={`/reports/${follow.report.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {follow.report.title}
              </Link>
              <div className="mt-1">
                <StatusBadge status={follow.report.status} />
              </div>
            </div>
            <FollowButton reportId={follow.report.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
