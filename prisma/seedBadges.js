// prisma/seedBadges.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const badges = [
  { code: "FIRST_REPORT", name: "First Report", icon: "🥇" },
  { code: "HELPER", name: "Community Helper", icon: "🤝" },
  { code: "RESOLVER", name: "Problem Resolver", icon: "🏆" }
];

  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { code: badge.code },
      update: {},
      create: badge,
    });
  }

  console.log("✅ All badges seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
