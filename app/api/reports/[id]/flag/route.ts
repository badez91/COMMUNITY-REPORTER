// app/api/reports/[id]/flag/route.ts

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

const AUTO_HIDE_THRESHOLD = 5; // auto hide after 5 flags

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const report = await prisma.report.findUnique({
    where: { id},
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (report.creatorId === session.user.id) {
    return NextResponse.json(
      { error: "You cannot flag your own report" },
      { status: 400 }
    );
  }

  if (report.isHidden) {
    return NextResponse.json(
      { error: "Report already hidden" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.report.update({
      where: { id },
      data: {
        flagged: { increment: 1 },
      },
    });

    // Auto-hide logic
    if (updated.flagged >= AUTO_HIDE_THRESHOLD) {
      await prisma.report.update({
        where: { id },
        data: { isHidden: true },
      });
    }

    return NextResponse.json({ success: true, flagged: updated.flagged });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to flag report" },
      { status: 500 }
    );
  }
}
