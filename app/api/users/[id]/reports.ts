// app\api\users\[id]\reports.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: any) {
  const { id } = params;
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 1);
  const pageSize = Number(url.searchParams.get("pageSize") || 5);
  const status = url.searchParams.get("status");

  const where: any = { creatorId: id };
  if (status && status !== "ALL") where.status = status;

  const reports = await prisma.report.findMany({
    where: {
    isHidden: false,
    duplicateOf: null,
      },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return NextResponse.json({ reports });
}
