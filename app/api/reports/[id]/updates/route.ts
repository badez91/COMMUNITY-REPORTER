// app/api/reports/[id]/updates/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { ActivityType } from "@prisma/client"; // <-- make sure this enum is imported
import { rateLimit } from "@/lib/rateLimiter";

type Props = { params: { id: string } | Promise<{ id: string }> };

export async function POST(req: Request, context: Props) {
  // If params is a Promise (Next.js 16+), unwrap it
  const paramsResolved = context.params instanceof Promise ? await context.params : context.params;
  const reportId = paramsResolved.id;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const identifier =
    session.user.email ||
    req.headers.get("x-forwarded-for") ||
    "anon";

  const { allowed, remainingTime } = rateLimit(
    `comment:${identifier}`,
    5,
    60_000
  );

  if (!allowed) {
    return NextResponse.json(
      {
        error: "Too many comments. Slow down.",
        retryAfter: Math.ceil((remainingTime || 0) / 1000),
      },
      { status: 429 }
    );
  }

  const body = await req.json();
  const message = body?.message?.trim();

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // Create activity/update for the report
  const activity = await prisma.activity.create({
    data: {
      message,
      reportId,
      userId: session.user.id,
      type: ActivityType.COMMENT_ADDED, // <-- REQUIRED field
    },
  });

  return NextResponse.json(activity, { status: 201 });
}
