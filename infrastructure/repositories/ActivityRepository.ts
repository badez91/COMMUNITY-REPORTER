import { ActivityType } from "@/domain/activity/ActivityType";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ActivityRepository {
  static create(
    tx: Prisma.TransactionClient,
    data: {
      type: ActivityType;
      userId: string;
      reportId: string;
      message: string;
    }
  ) {
    return tx.activity.create({ data });
  }

  static async listByReport(reportId: string) {
    try {
      return await prisma.activity.findMany({
        where: { reportId },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      throw new Error("Failed to list activities by report");
    }
  }

  static async listRecent(limit = 50) {
    try {
      return await prisma.activity.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
        include: { user: true, report: true },
      });
    } catch (error) {
      throw new Error("Failed to list recent activities");
    }
  }
}
