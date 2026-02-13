import { checkAndAwardBadges } from "@/lib/gamification";

async function main() {
  await checkAndAwardBadges("cmlhjpf4f0000kuunwxla1qrr");
  console.log("Done awarding badges");
}

main();
