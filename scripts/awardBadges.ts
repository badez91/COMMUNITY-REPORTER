import { checkAndAwardBadges } from "@/lib/gamification";

async function main() {
  try {
    await checkAndAwardBadges("cmlhjpf4f0000kuunwxla1qrr");
    console.log("Done awarding badges");
  } catch (error) {
    console.error("Error awarding badges:", error);
    process.exit(1);
  }
}

main();
