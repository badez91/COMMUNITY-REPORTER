import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ReportRepository } from "@/infrastructure/repositories/ReportRepository";
import { authOptions } from "@/lib/auth";
import type { ReportStatus } from "@prisma/client";
import { ReportStatusApplicationService } from "@/application/ReportStatusApplicationService";
import { prisma } from "@/lib/prisma";
import { GamificationService } from "@/application/GamificationService";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const paramsResolved = await context.params;
    const { id } = paramsResolved;
    
    const report = await ReportRepository.findById(id);
    if (!report)
      return NextResponse.json({ error: "Report not found" }, { status: 404 });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name ?? "Anonymous",
        image: session.user.image ?? "",
      },
    });

    let report;

    switch (status) {
      case "ACKNOWLEDGED":
        report = await ReportStatusApplicationService.acknowledge(
          id,
          user.id
        );
        const newBadges = await GamificationService.addPoints(user.id, 10);
              return NextResponse.json({
                report,
                newBadges,
              });
        break;

      case "IN_PROGRESS":
        report = await ReportStatusApplicationService.startProgress(
          id,
          user.id
        );
        break;

      case "CLOSED":
        report = await ReportStatusApplicationService.confirmClose(
          id,
          user.id
        );
        break;

      default:
        return NextResponse.json(
          { error: "Invalid status" },
          { status: 400 }
        );
    }
    const newBadges = await GamificationService.addPoints(user.id, 10);
      return NextResponse.json({
        report,
        newBadges,
      });

    return NextResponse.json(report);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message ?? "Failed to update status" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const paramsResolved = await context.params;
    const { id } = paramsResolved;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const report = await ReportRepository.findById(id);
    if (!report)
      return NextResponse.json({ error: "Report not found" }, { status: 404 });

    if (report.creatorId !== session.user.id)
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await ReportRepository.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
