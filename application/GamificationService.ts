import { GamificationDomainService } from "@/domain/gamification/GamificationDomainService";
import { checkAndAwardBadges } from "@/lib/gamification";
import { prisma } from "@/lib/prisma";

export class GamificationService {
  static async onFollow(tx: any, userId: string) {
    // Example: add 10 points for following a report
    await tx.user.update({
      where: { id: userId },
      data: { points: { increment: 10 } },
    });
    // Award first-follow badge if not already awarded
    const alreadyHasBadge = await tx.userBadge.findFirst({
      where: { userId, badge: { code: "FIRST_FOLLOW" } },
    });

    if (!alreadyHasBadge) {
      const badge = await tx.badge.findUnique({ where: { code: "FIRST_FOLLOW" } });
      if (badge) {
        await tx.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
      }
    }
  }

  static async onReportCreated(tx: any, userId: string) {
    // Award points for creating a report
    await tx.user.update({
      where: { id: userId },
      data: { points: { increment: 50 } },
    });

    const newBadges = await GamificationDomainService.checkAndAwardBadges(userId);

    return newBadges;
  }

  static async addPoints(userId: string, amount: number) {
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: { increment: amount },
      },
    });

    const newBadges = await GamificationDomainService.checkAndAwardBadges(userId);

    return newBadges;
  }
}

