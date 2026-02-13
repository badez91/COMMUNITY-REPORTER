import { getPrisma } from "./prismaClient";

export const createTestUser = async (overrides?: { name?: string; email?: string }) => {
  const prisma = getPrisma();
  return prisma.user.create({
    data: {
      name: overrides?.name ?? "Test User",
      email: overrides?.email ?? `user${Date.now()}@example.com`,
    },
  });
};

export const createTestReport = async (userId: string) => {
  const prisma = getPrisma();
  return prisma.report.create({
    data: {
      title: "Test Report",
      description: "This is a test report",
      category: "General",
      creator: { connect: { id: userId } },
    },
  });
};

