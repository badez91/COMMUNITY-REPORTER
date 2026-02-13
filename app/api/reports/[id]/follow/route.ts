import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { FollowApplicationService } from "@/application/FollowApplicationService";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { id: string };
};

export async function POST(req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name ?? "Anonymous",
        image: session.user.image ?? "",
      },
    });
    console.log("report.id : " + id);
    console.log("user.id : " + user.id);
    const follow = await FollowApplicationService.follow(id, user.id);

    return NextResponse.json(follow, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to follow report" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    await FollowApplicationService.unfollow(id, user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to unfollow report" },
      { status: 500 }
    );
  }
}
