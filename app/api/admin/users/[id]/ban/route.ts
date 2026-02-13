import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { ban } = await req.json(); // { ban: true/false }

  const user = await prisma.user.update({
    where: { id },
    data: { isBanned: ban },
  });

  return NextResponse.json(user);
}