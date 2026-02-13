import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 1);
  const pageSize = Number(url.searchParams.get("pageSize") || 5);
  const status = url.searchParams.get("status");

  const where: any = { creatorId: id };
  if (status && status !== "ALL") {
    where.status = status;
  }

  try {
    const reports = await prisma.report.findMany({
      where: {
      isHidden: false,
      duplicateOf: null,
        },
      include: {
        creator: true, // optional but good to keep consistent
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({ reports });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}
