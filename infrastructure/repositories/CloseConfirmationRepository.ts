import { prisma } from "@/lib/prisma";

export class CloseConfirmationRepository {
  static exists(reportId: string, userId: string) {
    return prisma.closeConfirmation.findFirst({ where: { reportId, userId } });
  }

  static create(reportId: string, userId: string) {
    return prisma.closeConfirmation.create({ data: { reportId, userId } });
  }

  static count(reportId: string) {
    return prisma.closeConfirmation.count({ where: { reportId } });
  }
}
