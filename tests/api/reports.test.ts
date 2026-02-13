// tests/api/reports.test.ts
import { prisma } from "@/lib/prisma";
import { ReportApplicationService } from "@/application/ReportApplicationService";
import { createTestUser } from "../helpers/createTestUser";
import { cleanDb } from "../helpers/cleanDb";

describe("Report creation", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("creates a report for a valid user", async () => {
    // ✅ 1. Create user FIRST
    const user = await createTestUser();

    // ✅ 2. Create report via ApplicationService
    const report = await ReportApplicationService.createReport(
      {
        title: "Broken streetlight",
        description: "Lamp not working",
        category: "INFRA",
      },
      user.id
    );

    // ✅ 3. Assertions
    expect(report).toBeDefined();
    expect(report.creatorId).toBe(user.id);
    expect(report.title).toBe("Broken streetlight");
  });
});
