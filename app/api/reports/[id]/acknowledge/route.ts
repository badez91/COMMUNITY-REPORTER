import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReportStatusApplicationService } from "@/application/ReportStatusApplicationService";
import { GamificationService } from "@/application/GamificationService";

export async function POST(req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name ?? "Anonymous",
        image: session.user.image ?? "",
      },
    });

    const report = await ReportStatusApplicationService.acknowledge(id, user.id);

    const newBadges = await GamificationService.addPoints(user.id, 10);
    return NextResponse.json({
      report,
      newBadges,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to acknowledge report" },
      { status: 500 }
    );
  }
}
