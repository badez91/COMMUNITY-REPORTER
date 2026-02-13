import { CreateReportDTO } from "@/types/dto/CreateReportDTO";
import { ActivityService } from "./ActivityService";
import { prisma } from "@/lib/prisma";
import { ReportDomainService } from "@/domain/report/ReportDomainService";
import { FollowDomainService } from "@/domain/follow/FollowDomainService";
import { GamificationService } from "./GamificationService";

export class ReportApplicationService {
  static async createReport(dto: CreateReportDTO, userId: string) {
    return prisma.$transaction(async (tx) => {
      const report = await ReportDomainService.create(dto, userId);

      // Auto-follow creator
      await FollowDomainService.autoFollow(report.id, userId, tx);

      // Gamification points + badge
      await GamificationService.onReportCreated(tx, userId);

      // Log activity for creation
      await ActivityService.reportCreated(tx, report, userId);

      return report;
    });
  }
}
