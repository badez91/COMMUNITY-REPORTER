// tests/helpers/cleanTestData.ts
import { prisma } from "@/lib/prisma";

export async function cleanTestData({
  userIds = [] as string[],
  reportIds = [] as string[],
}) {
  // Delete activities related to reports
  if (reportIds.length > 0) {
    await prisma.activity.deleteMany({
      where: { reportId: { in: reportIds } },
    });

    await prisma.follow.deleteMany({
      where: { reportId: { in: reportIds } },
    });

    await prisma.closeConfirmation.deleteMany({
      where: { reportId: { in: reportIds } },
    });

    await prisma.report.deleteMany({
      where: { id: { in: reportIds } },
    });
  }

  // Delete UserBadges first, then Users
  if (userIds.length > 0) {
    await prisma.userBadge.deleteMany({
      where: { userId: { in: userIds } },
    });

    await prisma.closeConfirmation.deleteMany({
      where: { userId: { in: userIds } },
    });

    await prisma.activity.deleteMany({
      where: { userId: { in: userIds } },
    });

    await prisma.follow.deleteMany({
      where: { userId: { in: userIds } },
    });

    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });
  }
}
