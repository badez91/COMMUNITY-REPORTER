import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class FollowRepository {

    static async find(
        tx: Prisma.TransactionClient,
        reportId: string,
        userId: string
    ){
        return tx.follow.findUnique({
            where: {
                userId_reportId: {
                    reportId,
                    userId,
                },
            },
        });
    }

    static async follow(
        tx: Prisma.TransactionClient,
        reportId: string,
        userId: string
    ){
        return tx.follow.create({
            data: {
                reportId,
                userId,
            },            
        });
    }

    static async unfollow(
        tx: Prisma.TransactionClient,
        reportId: string,
        userId: string
    ) {
        return tx.follow.delete({
            where: {
                userId_reportId: {
                    reportId,
                    userId,
                },
            },
        });
    }
}