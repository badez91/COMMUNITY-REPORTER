import { prisma } from "@/lib/prisma";

export class UserRepository {
    // addPoints(userId, points) {
    //     prisma.user.update({
    //         points += points
    //     })
    // }
    static addPoints(userId: string, points: number) {
        return prisma.user.update({
            where: { id: userId},
            data: {
                points: { increment: points },
            },
        });
    }
}