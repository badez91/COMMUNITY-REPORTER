import { NextResponse } from "next/server";
import { GamificationDomainService } from "@/domain/gamification/GamificationDomainService";

export async function GET() {
  const userId = "cmlhjpf4f0000kuunwxla1qrr";

  const result =
    await GamificationDomainService.checkAndAwardBadges(userId);

  return NextResponse.json({ awarded: result });
}
