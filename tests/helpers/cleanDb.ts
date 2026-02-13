import { prisma } from "@/lib/prisma";

export async function cleanDb() {
  await prisma.activity.deleteMany();
  await prisma.userBadge.deleteMany({});
  await prisma.follow.deleteMany();
  await prisma.closeConfirmation?.deleteMany?.(); // if exists
  await prisma.report.deleteMany();
  await prisma.badge.deleteMany({});
  await prisma.user.deleteMany();
}
