import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { hide } = await req.json(); // { hide: true/false }

  const report = await prisma.report.update({
    where: { id },
    data: { isHidden: hide },
  });

  return NextResponse.json(report);
}