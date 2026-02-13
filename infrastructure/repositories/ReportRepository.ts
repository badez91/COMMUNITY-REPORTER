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

    static async countByUser(userId: string) {
        try {
            return await prisma.report.count({
                where: {creatorId: userId},
            });
        } catch (error) {
            throw new Error("Failed to count user reports");
        }
    }

    static async findById(id: string) {
        try {
            return await prisma.report.findUnique({ where: { id } });
        } catch (error) {
            throw new Error("Failed to find report");
        }
    }

    static async updateStatus(id: string, status: ReportStatus) {
        try {
            return await prisma.report.update({ where: { id }, data: { status } });
        } catch (error) {
            throw new Error("Failed to update report status");
        }
    }

    // Delete method
    static async delete(id: string) {
        try {
            // Optional: remove related data first if necessary
            await prisma.closeConfirmation.deleteMany({ where: { reportId: id } });
            await prisma.follow.deleteMany({ where: { reportId: id } });

            return await prisma.report.delete({ where: { id } });
        } catch (error) {
            throw new Error("Failed to delete report");
        }
    }

    // fetch many reports with relations
    static async findManyWithRelations() {
        try {
            return await prisma.report.findMany({
                where: {
                    isHidden: false,
                    duplicateOf: null,
                },
                include: { creator: true, confirmations: true, follows: true },
                orderBy: { createdAt: "desc" },
            });
        } catch (error) {
            throw new Error("Failed to find reports");
        }
    }
}