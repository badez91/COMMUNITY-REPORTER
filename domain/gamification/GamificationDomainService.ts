import { prisma } from "@/lib/prisma";

export class GamificationDomainService {
  static async checkAndAwardBadges(userId: string) {
    const awardedBadges: string[] = [];

    // Get user with reports count
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        reports: true,
        badges: true,
        activity: true,
        closeConfirmations: true,
      },
    });

    if (!user) return [];

    const existingBadgeCodes = await prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    });

    const ownedCodes = existingBadgeCodes.map((b) => b.badge.code);

    // First Report
    if (user.reports.length >= 1 && !ownedCodes.includes("FIRST_REPORT")) {
      const badge = await prisma.badge.findUnique({
        where: { code: "FIRST_REPORT" },
      });

      if (badge) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });

        awardedBadges.push("FIRST_REPORT");
      }
    }

    // Helper ( 5 update)
    const updates = user.activity.filter(a => a.type === "COMMENT_ADDED");
    if (updates.length >= 5 && !ownedCodes.includes("HELPER")) {
      const badge = await prisma.badge.findUnique({
        where: { code: "HELPER" },
      });

      if (badge) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });

        awardedBadges.push("HELPER");
      }
    }
    
    // Resolver ( 2 confirmations )
    if (user.closeConfirmations.length >= 2 && !ownedCodes.includes("RESOLVER")) {
      const badge = await prisma.badge.findUnique({
        where: { code: "RESOLVER" },
      });

      if (badge) {
        await prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });

        awardedBadges.push("RESOLVER");
      }
    }

    return awardedBadges;
  }
}
