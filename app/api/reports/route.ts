// app/api/reports/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { ReportApplicationService } from "@/application/ReportApplicationService";
import { authOptions } from "@/lib/auth"; // next-auth options
import { CreateReportDTO } from "@/types/dto/CreateReportDTO";
import { rateLimit } from "@/lib/rateLimiter";

export async function POST(req: Request) {
  try {
    // 1️⃣ Get session from Google OAuth
    const session = await getServerSession(authOptions);

    const identifier =
      session?.user?.email ||
      req.headers.get("x-forwarded-for") ||
      "anonymous";

    const { allowed, remainingTime } = rateLimit(
      `create-report:${identifier}`,
      3,          // max 3
      60_000      // per 60 seconds
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error: "Too many reports. Please wait.",
          retryAfter: Math.ceil((remainingTime || 0) / 1000),
        },
        { status: 429 }
      );
    }
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2️⃣ Ensure user exists in DB
    const user = await prisma.user.upsert({
      where: { email: session.user.email },
      update: {},
      create: {
        email: session.user.email,
        name: session.user.name ?? "Anonymous",
        image: session.user.image ?? "",
      },
    });

    // 3️⃣ Parse request body
    const body: CreateReportDTO = await req.json();

    if (!body.title || !body.description || !body.category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      );
    }

    // 4️⃣ Create report using ApplicationService
    const report = await ReportApplicationService.createReport(body, user.id);

    return NextResponse.json(report, { status: 201 });
  } catch (err: any) {
    console.error("Error creating report:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    let userId: string | null = null;

    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      userId = user?.id ?? null;
    }
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const page = Number(url.searchParams.get("page") || 1);
    const pageSize = Number(url.searchParams.get("pageSize") || 5);
    const status = url.searchParams.get("status");
    const category = url.searchParams.get("category");

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status && status !== "ALL") {
      where.status = status;
    }

    if (category && category !== "ALL") {
      where.category = category;
    }

    const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where: {
        ...where,
        isHidden: false,
        duplicateOf: null,
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        follows: true,
        creator: true,
      },
    }),
    prisma.report.count({ where: {
      ...where,
      isHidden: false,
      duplicateOf: null,
    } }),
  ]);

    const mapped = reports.map((report) => ({
      id: report.id,
      title: report.title,
      description: report.description,
      status: report.status,
      category: report.category,
      createdAt: report.createdAt,
      creator: report.creator,
      creatorId: report.creatorId,
      isFollowing: userId
        ? report.follows.some((f) => f.userId === userId)
        : false,
    }));

    return NextResponse.json({ reports: mapped });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}


