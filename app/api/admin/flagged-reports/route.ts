import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const reports = await prisma.report.findMany({
    where: { flagged: { gt: 0 } },
    include: { creator: true },
    orderBy: { flagged: "desc" },
  });

  return NextResponse.json(reports);
}
