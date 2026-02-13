import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminReportRow from "./AdminReportRow";

export default async function AdminPage() {
  try {
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
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Creator</th>
                <th className="p-3 text-center">Flagged</th>
                <th className="p-3 text-center">Hidden</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <AdminReportRow key={report.id} report={report} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500 p-4">Error loading admin dashboard</p>;
  }
}
