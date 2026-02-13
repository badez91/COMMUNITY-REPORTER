// app/api/reports/create/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { title, description, category } = body;

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // Anti-spam: check last report
    const lastReport = await prisma.report.findFirst({
      where: { creatorId: userId },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();
    if (lastReport && now.getTime() - lastReport.createdAt.getTime() < 30 * 1000) {
      return NextResponse.json({ error: "Please wait 30 seconds before creating another report." }, { status: 429 });
    }

    const report = await prisma.report.create({
      data: { creatorId: userId, title, description, category },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    );
  }
}
