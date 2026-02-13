// scripts/makeAdmin.ts
// Run this script to make a user an admin
// Usage: npx ts-node scripts/makeAdmin.ts user@example.com

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function makeAdmin(email: string) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    });

    console.log('✅ User is now an admin:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\nMake sure the user has signed in at least once.');
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];

if (!email) {
  console.log('Usage: npx ts-node scripts/makeAdmin.ts user@example.com');
  process.exit(1);
}

makeAdmin(email);
