import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminReportRow from "./AdminReportRow";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return <p className="text-red-500 p-4">Unauthorized</p>;
  }

  // Fetch reports with creator info
  const reports = await prisma.report.findMany({
    include: { creator: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th>Creator</th>
            <th>Flagged</th>
            <th>Hidden</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <AdminReportRow key={report.id} report={report} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
