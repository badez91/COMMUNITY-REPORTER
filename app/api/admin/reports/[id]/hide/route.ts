import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { hide } = await req.json();

    const report = await prisma.report.update({
      where: { id },
      data: { isHidden: hide },
    });

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update report visibility" },
      { status: 500 }
    );
  }
}