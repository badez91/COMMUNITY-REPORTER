import { prisma } from "@/lib/prisma";
import { FollowRepository } from "@/infrastructure/repositories/FollowRepository";
import { ActivityService } from "./ActivityService";
import { GamificationService } from "./GamificationService";

export class FollowApplicationService {
  static async follow(reportId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await FollowRepository.find(tx, reportId, userId);

      // ✅ Idempotent: return existing follow if it exists
      if (existing) {
        return existing;
      }

      const follow = await FollowRepository.follow(tx, reportId, userId);

      await ActivityService.reportFollowed(tx, reportId, userId);
      await GamificationService.onFollow(tx, userId);

      return follow;
    });
  }

  static async unfollow(reportId: string, userId: string) {
    return prisma.$transaction(async (tx) => {
      const existing = await FollowRepository.find(tx, reportId, userId);

      // Optional: only unfollow if exists
      if (!existing) {
        return null;
      }

      await FollowRepository.unfollow(tx, reportId, userId);
      await ActivityService.reportUnfollowed(tx, reportId, userId);

      return null;
    });
  }
}
