import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ MUST await

  try {
    const body = await req.json().catch(() => null);
    const { duplicateOf } = body || {};

    if (!duplicateOf) {
      return NextResponse.json(
        { error: "duplicateOf is required" },
        { status: 400 }
      );
    }

    await prisma.report.update({
      where: { id },
      data: {
        duplicateOf,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to mark duplicate" },
      { status: 500 }
    );
  }
}
