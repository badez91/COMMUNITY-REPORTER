// api/users/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ MUST await


  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      badges: { include: { badge: true } },
      activity: { orderBy: { createdAt: "desc" }, include: { user: true } },
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  return NextResponse.json(user);
}
