import { prisma } from "@/lib/prisma";

export class CloseConfirmationRepository {
  static async exists(reportId: string, userId: string) {
    try {
      return await prisma.closeConfirmation.findFirst({ where: { reportId, userId } });
    } catch (error) {
      throw new Error("Failed to check close confirmation");
    }
  }

  static async create(reportId: string, userId: string) {
    try {
      return await prisma.closeConfirmation.create({ data: { reportId, userId } });
    } catch (error) {
      throw new Error("Failed to create close confirmation");
    }
  }

  static async count(reportId: string) {
    try {
      return await prisma.closeConfirmation.count({ where: { reportId } });
    } catch (error) {
      throw new Error("Failed to count close confirmations");
    }
  }
}
