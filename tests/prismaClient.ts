import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

export const getPrisma = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: ["error"],
    });
  }
  return prisma;
};

export const disconnectPrisma = async () => {
  if (prisma) await prisma.$disconnect();
};
