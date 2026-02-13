import { NextResponse } from "next/server";
import { GamificationDomainService } from "@/domain/gamification/GamificationDomainService";

export async function GET() {
  try {
    const userId = "cmlhjpf4f0000kuunwxla1qrr";

    const result =
      await GamificationDomainService.checkAndAwardBadges(userId);

    return NextResponse.json({ awarded: result });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to award badges" },
      { status: 500 }
    );
  }
}
