import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      id: 'sec-1',
      email: 'admin@company.com',
      role: UserRole.SECRETARY,
    },
  });

  await prisma.user.upsert({
    where: { email: 'boss@company.com' },
    update: {},
    create: {
      id: 'man-1',
      email: 'boss@company.com',
      role: UserRole.MANAGER,
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@company.com' },
    update: {},
    create: {
      id: 'emp-1',
      email: 'user@company.com',
      role: UserRole.EMPLOYEE,
      hasElectricVehicle: true,
    },
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
