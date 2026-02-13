// tests/api/reportFollow.test.ts
import { prisma } from "@/lib/prisma";
import { FollowApplicationService } from "@/application/FollowApplicationService";
import { createTestUser } from "../helpers/createTestUser";
import { cleanDb } from "../helpers/cleanDb";

let userId: string;
let reportId: string;

describe("Follow report", () => {
  beforeEach(async () => {
    await cleanDb();

    // ✅ 1. Create user
    const user = await createTestUser();
    userId = user.id;

    // ✅ 2. Create report owned by SAME user
    const report = await prisma.report.create({
      data: {
        title: "Road crack",
        description: "Crack on highway",
        category: "INFRA",
        creatorId: userId, // 🔑 FK satisfied
      },
    });

    reportId = report.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("allows user to follow a report", async () => {
    const follow = await FollowApplicationService.follow(reportId, userId);

    expect(follow).toBeDefined();
    expect(follow.userId).toBe(userId);
    expect(follow.reportId).toBe(reportId);
  });

  it("allows user to unfollow a report", async () => {
    await FollowApplicationService.follow(reportId, userId);

    await FollowApplicationService.unfollow(reportId, userId);

    const existing = await prisma.follow.findFirst({
      where: {
        reportId,
        userId,
      },
    });

    expect(existing).toBeNull();
  });
});
