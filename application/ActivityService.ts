import { ActivityType } from "@/domain/activity/ActivityType";
import { ActivityRepository } from "@/infrastructure/repositories/ActivityRepository";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { Activity } from "react";

export class ActivityService {
  static async reportFollowed(
    tx: Prisma.TransactionClient,
    reportId: string,
    userId: string
  ) {
    return tx.activity.create({
      data: {
        type: "REPORT_FOLLOWED",
        userId,
        reportId,
        message: "User followed a report",
      },
    });
  }

  static async reportUnfollowed(
    tx: Prisma.TransactionClient,
    reportId: string,
    userId: string
  ) {
    return tx.activity.create({
      data: {
        type: "REPORT_UNFOLLOWED",
        userId,
        reportId,
        message: "User unfollowed a report",
      },
    });
  }

  static async reportCreated(tx: any, report: any, userId: string) {
    return ActivityRepository.create(tx, {
      reportId: report.id,
      userId,
      type: ActivityType.REPORT_CREATED,
      message: `Created report "${report.title}"`,
    });
  }

  static async listByReport(reportId: string, tx?: Prisma.TransactionClient) {
  const client = tx ?? prisma;
  return client.activity.findMany({
    where: { reportId },
    orderBy: { createdAt: "desc" },
  });
}

}
