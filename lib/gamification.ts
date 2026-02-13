import { prisma } from "./prisma";

const POINT_BADGES = [100, 500, 1000, 2000, 5000, 10000];

export async function checkAndAwardBadges(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      reports: true,
      badges: {
        include: { badge: true },
      },
    },
  });

  if (!user) return [];

  const earnedCodes = user.badges.map((b) => b.badge.code);
  const newBadges: string[] = [];

  // 🎖 FIRST REPORT
  if (user.reports.length >= 1 && !earnedCodes.includes("FIRST_REPORT")) {
    await award(userId, "FIRST_REPORT");
    newBadges.push("FIRST_REPORT");
  }

  // 🎖 POINT BADGES
  for (const threshold of POINT_BADGES) {
    const code = `point_${threshold}`;
    if (user.points >= threshold && !earnedCodes.includes(code)) {
      await award(userId, code);
      newBadges.push(code);
    }
  }

  return newBadges;
}

async function award(userId: string, badgeCode: string) {
  const badge = await prisma.badge.findUnique({
    where: { code: badgeCode },
  });

  if (!badge) return;

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  });
}
