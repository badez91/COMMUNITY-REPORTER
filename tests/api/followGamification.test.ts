// tests/api/followGamification.test.ts
import { prisma } from "@/lib/prisma";
import { FollowApplicationService } from "@/application/FollowApplicationService";
import { ReportApplicationService } from "@/application/ReportApplicationService";
import { ActivityService } from "@/application/ActivityService";
import { cleanDb } from "../helpers/cleanDb";

describe("Follow + Gamification flow", () => {
  let creatorId: string;
  let followerId: string;
  let reportId: string;
  let firstFollowBadgeId: string;

  beforeAll(async () => {
    // Clean DB in correct order
    await cleanDb();

    // Create a badge for "First Follow"
    const firstFollowBadge = await prisma.badge.create({
      data: {
        code: "FIRST_FOLLOW",
        name: "First Follow",
        icon: "⭐",
      },
    });
    firstFollowBadgeId = firstFollowBadge.id;

    // Create creator
    const creator = await prisma.user.create({
      data: { name: "Creator", email: "creator@example.com", points: 0 },
    });
    creatorId = creator.id;

    // Create follower
    const follower = await prisma.user.create({
      data: { name: "Follower", email: "follower@example.com", points: 0 },
    });
    followerId = follower.id;

    // Create a report
    const report = await ReportApplicationService.createReport(
      {
        title: "Broken streetlight",
        description: "Streetlight not working",
        category: "INFRA",
      },
      creatorId
    );
    reportId = report.id;
  });

  it("awards points and badges when following", async () => {
    await FollowApplicationService.follow(reportId, followerId);

    // Check points
    const follower = await prisma.user.findUnique({ where: { id: followerId } });
    expect(follower?.points).toBe(10); // adjust according to your GamificationService

    // Check badge awarded via UserBadge join table
    const userBadges = await prisma.userBadge.findMany({
      where: { userId: followerId },
      include: { badge: true },
    });

    expect(userBadges.length).toBeGreaterThanOrEqual(1);
    const badgeNames = userBadges.map(ub => ub.badge.name);
    expect(badgeNames).toContain("First Follow");

    // Activity log
    const activities = await ActivityService.listByReport(reportId);
    const followActivity = activities.find(a => a.message.includes("followed"));
    expect(followActivity).toBeDefined();
  });

  it("prevents duplicate follow and does not award extra points or badges", async () => {
    const beforePoints = (await prisma.user.findUnique({ where: { id: followerId } }))?.points;
    const beforeBadges = await prisma.userBadge.findMany({ where: { userId: followerId } });

    await expect(FollowApplicationService.follow(reportId, followerId)).rejects.toThrow();

    const afterPoints = (await prisma.user.findUnique({ where: { id: followerId } }))?.points;
    const afterBadges = await prisma.userBadge.findMany({ where: { userId: followerId } });

    expect(afterPoints).toBe(beforePoints);
    expect(afterBadges.map(b => b.id)).toEqual(beforeBadges.map(b => b.id));
  });

  it("allows unfollow and logs activity", async () => {
    await FollowApplicationService.unfollow(reportId, followerId);

    // Follow record deleted
    const follow = await prisma.follow.findUnique({
      where: { userId_reportId: { userId: followerId, reportId } },
    });
    expect(follow).toBeNull();

    // Activity log check
    const activities = await ActivityService.listByReport(reportId);
    const unfollowActivity = activities.find(a => a.message.includes("unfollowed"));
    expect(unfollowActivity).toBeDefined();
  });
});
