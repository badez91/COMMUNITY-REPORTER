// tests/api/reportStatus.domain.test.ts
import { prisma } from "@/lib/prisma";
import { createTestUser } from "../helpers/createTestUser";
import { cleanDb } from "../helpers/cleanDb";
import { ReportDomainService } from "@/domain/report/ReportDomainService";
import { ActivityType } from "@/domain/activity/ActivityType";

let creatorId: string;
let reportId: string;
let otherUserId: string;

describe("ReportDomainService – status transitions", () => {
  beforeEach(async () => {
    await cleanDb();

    // Creator
    const creator = await createTestUser({ email: "creator@example.com" });
    creatorId = creator.id;

    // Other user
    const otherUser = await createTestUser({ email: "user@example.com" });
    otherUserId = otherUser.id;

    // Report
    const report = await prisma.report.create({
      data: {
        title: "Broken traffic light",
        description: "Intersection issue",
        category: "INFRA",
        creatorId,
      },
    });

    reportId = report.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("starts with OPEN status", async () => {
    const report = await prisma.report.findUnique({ where: { id: reportId } });
    expect(report?.status).toBe("OPEN");
  });

  it("allows creator to start progress", async () => {
    const updated = await ReportDomainService.startProgress(reportId, creatorId);
    expect(updated.status).toBe("IN_PROGRESS");

    const activity = await prisma.activity.findFirst({
      where: { reportId, userId: creatorId, type: ActivityType.REPORT_IN_PROGRESS },
    });
    expect(activity).not.toBeNull();
  });

  it("prevents non-creator from starting progress if rules forbid", async () => {
    await expect(
      ReportDomainService.startProgress(reportId, otherUserId)
    ).rejects.toThrow();
  });

  it("allows other user to confirm close and creator to close", async () => {
    // Start progress first
    await ReportDomainService.startProgress(reportId, creatorId);

    // Confirm close
    const confirmation = await ReportDomainService.confirmClose(reportId, otherUserId);
    expect(confirmation.userId).toBe(otherUserId);

    const activity = await prisma.activity.findFirst({
      where: { reportId, userId: otherUserId, type: ActivityType.REPORT_CONFIRMED_CLOSE },
    });
    expect(activity).not.toBeNull();

    // Close report
    const closed = await ReportDomainService.close(reportId, creatorId);
    expect(closed.status).toBe("CLOSED");

    const closeActivity = await prisma.activity.findFirst({
      where: { reportId, userId: creatorId, type: ActivityType.REPORT_CLOSED },
    });
    expect(closeActivity).not.toBeNull();
  });

  it("allows other user to confirm close", async () => {
  const confirmation = await ReportDomainService.confirmClose(reportId, otherUserId);
  expect(confirmation.userId).toBe(otherUserId);

  const activity = await prisma.activity.findFirst({
    where: { reportId, userId: otherUserId, type: "REPORT_CONFIRMED_CLOSE" },
  });
  expect(activity).not.toBeNull();

  // Prevent duplicate
  await expect(
    ReportDomainService.confirmClose(reportId, otherUserId)
  ).rejects.toThrow("User already confirmed close");
});

it("prevents non-creator from closing the report", async () => {
  await ReportDomainService.startProgress(reportId, creatorId);
  await ReportDomainService.confirmClose(reportId, otherUserId);

  await expect(
    ReportDomainService.close(reportId, otherUserId)
  ).rejects.toThrow("Only creator can close");
});

it("prevents closing report without confirmation", async () => {
  await ReportDomainService.startProgress(reportId, creatorId);
  await expect(
    ReportDomainService.close(reportId, creatorId)
  ).rejects.toThrow("Cannot close: not enough confirmations");
});

it("allows creator to close after confirmation", async () => {
  await ReportDomainService.startProgress(reportId, creatorId);
  await ReportDomainService.confirmClose(reportId, otherUserId);

  const closed = await ReportDomainService.close(reportId, creatorId);
  expect(closed.status).toBe("CLOSED");

  const activity = await prisma.activity.findFirst({
    where: { reportId, userId: creatorId, type: "REPORT_CLOSED" },
  });
  expect(activity).not.toBeNull();
});

});
