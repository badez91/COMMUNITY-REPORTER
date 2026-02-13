import { prisma } from "@/lib/prisma";

export async function createTestReport(creatorId: string) {
  const report = await prisma.report.create({
    data: {
      title: "Broken traffic light",
      description: "Intersection issue",
      category: "INFRA",
      creatorId,
      status: "OPEN", // default, optional
    },
  });

  return report;
}
