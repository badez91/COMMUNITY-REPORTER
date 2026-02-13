import { prisma } from "@/lib/prisma";
import { createTestUser } from "../helpers/createTestUser";
import { cleanDb } from "../helpers/cleanDb";
import { ReportStatus } from "@prisma/client";

let reportId: string;
let userId: string;

describe("Report status transitions", () => {
  beforeAll(async () => {
    await cleanDb();

    // 1️⃣ Create user FIRST
    const user = await createTestUser();
    userId = user.id;

    // 2️⃣ Create report with valid creatorId
    const report = await prisma.report.create({
      data: {
        title: "Pothole",
        description: "Big pothole on main road",
        category: "INFRA",
        creatorId: userId, // ✅ FK satisfied
      },
    });

    reportId = report.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("starts in OPEN status", async () => {
    const report = await prisma.report.findUnique({
      where: { id: reportId },
    });

    expect(report?.status).toBe(ReportStatus.OPEN);
  });

  it("can transition to IN_PROGRESS", async () => {
    const updated = await prisma.report.update({
      where: { id: reportId },
      data: { status: ReportStatus.IN_PROGRESS },
    });

    expect(updated.status).toBe(ReportStatus.IN_PROGRESS);
  });
});
