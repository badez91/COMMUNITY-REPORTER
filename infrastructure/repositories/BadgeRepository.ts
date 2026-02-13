import { prisma } from "@/lib/prisma";

export class BadgeRepository {
    // findByName(name) {
    //     return prisma.badge.findUnique({ name })
    // }

    static async hasBadge(userId: string, badgeCode: string) {
    try {
      return await prisma.userBadge.findFirst({
        where: {
          userId,
          badge: {
            code: badgeCode,
          },
        },
      });
    } catch (error) {
      throw new Error("Failed to check badge");
    }
  }

  static async grantBadge(userId: string, badgeCode: string) {
    try {
      const badge = await prisma.badge.findUnique({
        where: { code: badgeCode },
      });

      if (!badge) return;

      return await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });
    } catch (error) {
      throw new Error("Failed to grant badge");
    }
  }
}