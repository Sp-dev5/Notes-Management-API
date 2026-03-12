import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin@123456', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create demo user
  const demoPassword = await bcrypt.hash('demo@123456', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
      passwordHash: demoPassword,
      role: 'USER',
    },
  });

  // Create sample notes
  await prisma.note.create({
    data: {
      title: 'Welcome to Notes Management',
      content: 'This is your first note. You can edit, delete, or create new notes using the interface.',
      userId: demoUser.id,
    },
  });

  console.log('Seed completed successfully');
  console.log(`Admin: admin@example.com / admin@123456`);
  console.log(`Demo: demo@example.com / demo@123456`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
