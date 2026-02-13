import { prisma } from "@/lib/prisma";
import { CreateReportDTO } from "@/types/dto/CreateReportDTO";
import { ReportStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

const status: ReportStatus = ReportStatus.OPEN;

export class ReportRepository {
    // save(report) {
    //     prisma.report.create(report.toPersistence())
    // }
    static create(
      tx: Prisma.TransactionClient,
      dto: CreateReportDTO,
      creatorId: string
    ) {
        return tx.report.create({
          data: {
            title: dto.title,
            description: dto.description,
            category: dto.category,
            status: "OPEN",
            creatorId: creatorId,
          }
        })
    }

    static countByUser(userId: string) {
        // return prisma.report.count({creatorId: userId})
        return prisma.report.count({
            where: {creatorId: userId},
        });
    }

    static findById(id: string) {
    return prisma.report.findUnique({ where: { id } });
  }

  static updateStatus(id: string, status: ReportStatus) {
    return prisma.report.update({ where: { id }, data: { status } });
  }

  // Delete method
  static async delete(id: string) {
    // Optional: remove related data first if necessary
    await prisma.closeConfirmation.deleteMany({ where: { reportId: id } });
    await prisma.follow.deleteMany({ where: { reportId: id } });

    return prisma.report.delete({ where: { id } });
  }

  // fetch many reports with relations
  static async findManyWithRelations() {
    return prisma.report.findMany({
      where: {
    isHidden: false,
    duplicateOf: null,
      },
      include: { creator: true, confirmations: true, follows: true },
      orderBy: { createdAt: "desc" },
    });
  }
}