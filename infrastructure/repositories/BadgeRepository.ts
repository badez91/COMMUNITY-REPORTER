import { prisma } from "@/lib/prisma";

export class BadgeRepository {
    // findByName(name) {
    //     return prisma.badge.findUnique({ name })
    // }

    static async hasBadge(userId: string, badgeCode: string) {
    return prisma.userBadge.findFirst({
      where: {
        userId,
        badge: {
          code: badgeCode,
        },
      },
    });
  }

  static async grantBadge(userId: string, badgeCode: string) {
    const badge = await prisma.badge.findUnique({
      where: { code: badgeCode },
    });

    if (!badge) return;

    return prisma.userBadge.create({
      data: {
        userId,
        badgeId: badge.id,
      },
    });
  }
}