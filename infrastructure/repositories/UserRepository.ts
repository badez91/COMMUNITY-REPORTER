import { prisma } from "@/lib/prisma";

export class UserRepository {
    // addPoints(userId, points) {
    //     prisma.user.update({
    //         points += points
    //     })
    // }
    static async addPoints(userId: string, points: number) {
        try {
            return await prisma.user.update({
                where: { id: userId},
                data: {
                    points: { increment: points },
                },
            });
        } catch (error) {
            throw new Error("Failed to add points");
        }
    }
}