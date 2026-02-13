// app/reports/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import ActivityList from "@/app/components/ActivityList";
import ReportStatusUpdater from "@/app/components/ReportStatusUpdater";
import StatusBadge from "@/app/components/StatusBadge";
import UpdateForm from "@/app/components/UpdateForm";
import BackButton from "@/app/components/BackButton";

type Props = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function ReportDetailPage({ params }: Props) {
  // Unwrap async params
  const { id } = await params;

  if (!id) return notFound();

  // Fetch report with creator and activities
  const report = await prisma.report.findUnique({
    where: { id },
    include: {
      activity: { include: { user: true }, orderBy: { createdAt: "asc" } },
      creator: true,
    },
  });

  console.log("reportId : " + report?.id);
  if (!report) return notFound();

  if (report.duplicateOf) {
  redirect(`/reports/${report.duplicateOf}`);
    }

  const statusColor: Record<string, string> = {
    OPEN: "bg-yellow-100 text-yellow-800",
    ACKNOWLEDGED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    CLOSED: "bg-green-100 text-green-800",
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Back button */}
      {/* <Link
        href="/"
        className="inline-block text-blue-600 hover:underline mb-2"
      >
        ← Back to Reports
      </Link> */}

      {/* Report title and category/status */}
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">{report.title}</h1>
        <div className="flex gap-2 items-center">
          <span className="px-2 py-0.5 bg-gray-200 rounded">{report.category}</span>
          <StatusBadge status={report.status} />
          <ReportStatusUpdater
            reportId={report.id}
            currentStatus={report.status}
          />
        </div>
      </div>

      {/* Description */}
      <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
        <p className="text-gray-700 leading-relaxed">{report.description}</p>
      </div>

      {/* Updates / activity */}
      <div className="mt-4">
        <h2 className="font-semibold text-lg mb-2">Activity & Updates</h2>
        <ActivityList activities={report.activity} />
      </div>
      

      {/* Update form */}
      <div className="mt-6">
        <UpdateForm reportId={report.id} />
      </div>
      <BackButton />
    </div>
  );
}
