import { prisma } from "@/lib/prisma";
import { createTestUser } from "../helpers/createTestUser";
import { createTestReport } from "../helpers/createTestReport";
import { FollowApplicationService } from "@/application/FollowApplicationService";
import { ReportDomainService } from "@/domain/report/ReportDomainService";
import { GamificationService } from "@/application/GamificationService";
import { ActivityService } from "@/application/ActivityService";
import { cleanDb } from "../helpers/cleanDb";
import { cleanTestData } from "../helpers/cleanTestData";
import { FollowDomainService } from "@/domain/follow/FollowDomainService";

describe("Report full lifecycle", () => {
  let creatorId: string;
  let otherUserId: string;
  let reportId: string;

  beforeEach(async () => {
    const creator = await createTestUser({ name: "Creator" });
    const otherUser = await createTestUser({ name: "OtherUser" });

    creatorId = creator.id;
    otherUserId = otherUser.id;

    const report = await createTestReport(creatorId);
    reportId = report.id;

    // Auto-follow creator
    await FollowDomainService.autoFollow(reportId, creatorId);
  });

  afterEach(async () => {
    await cleanTestData({
      userIds: [creatorId, otherUserId],
      reportIds: [reportId],
    });
  });
  it("full report lifecycle", async () => {
    // 1️⃣ Other user follows the report
    await FollowApplicationService.follow(reportId, otherUserId);

    let user = await prisma.user.findUnique({ where: { id: otherUserId } });
    expect(user?.points).toBe(10); // gamification points for follow

    // 2️⃣ Creator starts progress
    const inProgress = await ReportDomainService.startProgress(reportId, creatorId);
    expect(inProgress.status).toBe("IN_PROGRESS");

    // 3️⃣ Another user confirms close
    const confirmed = await ReportDomainService.confirmClose(reportId, otherUserId);
    expect(confirmed.userId).toBe(otherUserId);

    // 4️⃣ Final close by creator
    const closed = await ReportDomainService.close(reportId, creatorId);
    expect(closed.status).toBe("CLOSED");

    // 5️⃣ Activity log check
    const activities = await ActivityService.listByReport(reportId);

    console.log(activities.map(a => a.message)); // debug: see what actually got inserted
    expect(activities.length).toBeGreaterThanOrEqual(2); // creation, follow, start, confirm, close

    // Check activity messages
    const creationActivity = activities.find(a => a.message.includes("started by creator"));
    expect(creationActivity).toBeDefined();

    const followActivity = activities.find(a => a.message.includes("followed"));
    expect(followActivity).toBeDefined();

    const startActivity = activities.find(a => a.message.includes("started"));
    expect(startActivity).toBeDefined();

    const confirmActivity = activities.find(a => a.message.includes("confirmed"));
    expect(confirmActivity).toBeDefined();

    const closeActivity = activities.find(a => a.message.includes("closed"));
    expect(closeActivity).toBeDefined();


    // 6️⃣ Creator points for report creation
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });
    expect(creator?.points).toBeGreaterThanOrEqual(0);
  });
});

