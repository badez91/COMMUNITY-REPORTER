// app/api/admin/reports/[id]/duplicate/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const reportId = params.id;
  const { originalId } = await req.json();

  await prisma.report.update({
    where: { id: reportId },
    data: { duplicateOf: originalId },
  });

  return NextResponse.json({ success: true });
}
