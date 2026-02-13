import { prisma } from "@/lib/prisma";
import { CreateReportDTO } from "@/types/dto/CreateReportDTO";
import { ReportStatus } from "@prisma/client";

export class ReportDomainService {

  static async create(dto: CreateReportDTO, creatorId: string, tx?: typeof prisma) {
    const client = tx ?? prisma;

    return client.report.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        creatorId,
      },
    });
  }

  static async startProgress(reportId: string, userId: string) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new Error("Report not found");
    if (report.status !== ReportStatus.OPEN) throw new Error("Report not OPEN");

    if (report.creatorId !== userId) throw new Error("Only creator can start progress");

    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.IN_PROGRESS },
    });

    await prisma.activity.create({
      data: {
        reportId,
        userId,
        type: "REPORT_IN_PROGRESS",
        message: `Report "${report.title}" started by creator`,
      },
    });

    return updated;
  }

  static async confirmClose(reportId: string, userId: string) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new Error("Report not found");

    // Prevent duplicate confirmations
    const existing = await prisma.closeConfirmation.findFirst({ where: { reportId, userId } });
    if (existing) throw new Error("User already confirmed close");

    const confirmation = await prisma.closeConfirmation.create({
      data: { reportId, userId },
    });

    await prisma.activity.create({
      data: {
        reportId,
        userId,
        type: "REPORT_CONFIRMED_CLOSE",
        message: `User confirmed close`,
      },
    });

    return confirmation;
  }

  static async close(reportId: string, userId: string) {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    if (!report) throw new Error("Report not found");

    if (report.creatorId !== userId) throw new Error("Only creator can close");

    const confirmations = await prisma.closeConfirmation.findMany({ where: { reportId } });
    if (confirmations.length < 1) throw new Error("Cannot close: not enough confirmations");

    const closed = await prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.CLOSED },
    });

    await prisma.activity.create({
      data: {
        reportId,
        userId,
        type: "REPORT_CLOSED",
        message: `Report "${report.title}" closed by creator`,
      },
    });

    return closed;
  }
}
