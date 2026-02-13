// application\ReportStatusApplicationService.ts
import { ReportRepository } from "@/infrastructure/repositories/ReportRepository";
import { CloseConfirmationRepository } from "@/infrastructure/repositories/CloseConfirmationRepository";
import { BadgeRepository } from "@/infrastructure/repositories/BadgeRepository";
import { ReportStatus } from "@prisma/client";
import { ReportStatusDomainService } from "@/domain/report/ReportStatusDomainService";

const CLOSE_THRESHOLD = 2;

export class ReportStatusApplicationService {
  static async acknowledge(reportId: string, userId: string) {
    const report = await ReportRepository.findById(reportId);
    if (!report) throw new Error("Report not found");
    if (!ReportStatusDomainService.canAcknowledge(report, userId))
      throw new Error("Cannot acknowledge");
    return ReportRepository.updateStatus(reportId, ReportStatus.ACKNOWLEDGED);
  }

  static async startProgress(reportId: string, userId: string) {
    const report = await ReportRepository.findById(reportId);
    if (!report) throw new Error("Report not found");
    if (!ReportStatusDomainService.canStartProgress(report, userId))
      throw new Error("Cannot start progress");
    return ReportRepository.updateStatus(reportId, ReportStatus.IN_PROGRESS);
  }

  static async confirmClose(reportId: string, userId: string) {
    const report = await ReportRepository.findById(reportId);
    if (!report) throw new Error("Report not found");
    if (!ReportStatusDomainService.canRequestClose(report, userId))
      throw new Error("Cannot request close");

    const already = await CloseConfirmationRepository.exists(reportId, userId);
    if (already) return report;

    await CloseConfirmationRepository.create(reportId, userId);
    const count = await CloseConfirmationRepository.count(reportId);

    if (count >= CLOSE_THRESHOLD) {
      await ReportRepository.updateStatus(reportId, ReportStatus.CLOSED);
    }

    return await ReportRepository.findById(reportId);

  }
}
