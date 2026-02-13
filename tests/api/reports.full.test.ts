import { prisma } from "@/lib/prisma";
import { ReportApplicationService } from "@/application/ReportApplicationService";
import { createTestUser } from "../helpers/createTestUser";
import { cleanDb } from "../helpers/cleanDb";
import { ActivityType } from "@prisma/client";

describe("ReportApplicationService – create report", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a report for a valid user", async () => {
    // 1️⃣ Arrange: create user
    const user = await createTestUser();

    // 2️⃣ Act: create report
    const report = await ReportApplicationService.createReport(
      {
        title: "Broken streetlight",
        description: "Streetlight not working at night",
        category: "INFRA",
      },
      user.id
    );

    // 3️⃣ Assert: report created
    expect(report).toBeDefined();
    expect(report.id).toBeDefined();
    expect(report.title).toBe("Broken streetlight");
    expect(report.creatorId).toBe(user.id);

    // 4️⃣ Assert: auto-follow happened
    const follow = await prisma.follow.findFirst({
      where: {
        reportId: report.id,
        userId: user.id,
      },
    });

    expect(follow).not.toBeNull();

    // 5️⃣ Assert: activity logged
    const activity = await prisma.activity.findFirst({
      where: {
        reportId: report.id,
        userId: user.id,
      },
    });

    expect(activity).not.toBeNull();
    expect(activity?.type).toBe(ActivityType.REPORT_CREATED);
    expect(activity?.message).toContain("Broken streetlight");

  });
});
