import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { ban } = body;

    if (typeof ban !== "boolean") {
      return NextResponse.json(
        { error: "Invalid ban value" },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isBanned: ban },
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user ban status" },
      { status: 500 }
    );
  }
}