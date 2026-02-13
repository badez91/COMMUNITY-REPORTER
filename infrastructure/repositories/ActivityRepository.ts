import { ActivityType } from "@/domain/activity/ActivityType";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ActivityRepository {
  static create(
    tx: Prisma.TransactionClient,
    data: {
      type: string; // Or ActivityType
      userId: string;
      reportId: string;
      message: string;
    }
  ) {
    return tx.activity.create({ data });
  }

  static async listByReport(reportId: string) {
    return prisma.activity.findMany({
      where: { reportId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async listRecent(limit = 50) {
    return prisma.activity.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: { user: true, report: true },
    });
  }
}
