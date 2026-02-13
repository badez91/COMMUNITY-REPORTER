import { FollowRepository } from "@/infrastructure/repositories/FollowRepository"
import { Follow } from "@prisma/client";

export class FollowDomainService {
    static async autoFollow(reportId: string, userId: string, tx?: any) {
    return FollowRepository.follow(tx, reportId, userId);
  }

    static canFollow(existingFollow: Follow | null) {
        if (existingFollow) {
            throw new Error("Already following this report");
        }
    }

    static canUnfollow(existingFollow: Follow |  null) {
        if (!existingFollow) {
            throw new Error("Not following this report");
        }
    }
}