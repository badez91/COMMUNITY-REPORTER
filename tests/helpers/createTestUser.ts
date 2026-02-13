import { prisma } from "@/lib/prisma";

export async function createTestUser(data?: { email?: string; name?: string }) {
  const user = await prisma.user.create({
    data: {
      email: data?.email ?? `test${Date.now()}@example.com`,
      name: data?.name ?? "Test User",
      points: 0, // ensure points exists
    },
  });

  return user;
}
