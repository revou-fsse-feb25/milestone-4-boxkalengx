import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const saltRounds = 10;

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const userPassword = await bcrypt.hash('user123', saltRounds);

  // Create users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Regular User',
      role: 'USER',
    },
  });

  // Create accounts with initial balances
  const adminAccount = await prisma.account.create({
    data: {
      name: 'Admin Account',
      balance: 5000,
      userId: admin.id,
    },
  });

  const userAccount = await prisma.account.create({
    data: {
      name: 'User Account',
      balance: 1000, // Starting with lower balance to match transaction flow
      userId: user.id,
    },
  });

  // Transaction 1: User deposit
  await prisma.transaction.create({
    data: {
      type: 'DEPOSIT',
      amount: 1000,
      description: 'User deposit',
      accountId: userAccount.id,
    },
  });

  // Update user account balance after deposit
  await prisma.account.update({
    where: { id: userAccount.id },
    data: { balance: 2000 }, // 1000 + 1000
  });

  // Transaction 2: User withdrawal
  await prisma.transaction.create({
    data: {
      type: 'WITHDRAW',
      amount: 500,
      description: 'User withdrawal',
      accountId: userAccount.id,
    },
  });

  // Update user account balance after withdrawal
  await prisma.account.update({
    where: { id: userAccount.id },
    data: { balance: 1500 }, // 2000 - 500
  });

  // Transaction 3: Transfer from user to admin
  // Create debit transaction for sender
  await prisma.transaction.create({
    data: {
      type: 'TRANSFER',
      amount: 300,
      description: 'Transfer to Admin (Debit)',
      accountId: userAccount.id,
      senderId: user.id,
      receiverId: admin.id,
    },
  });

  // Create credit transaction for receiver (if your schema supports it)
  await prisma.transaction.create({
    data: {
      type: 'TRANSFER',
      amount: 300,
      description: 'Transfer from User (Credit)',
      accountId: adminAccount.id,
      senderId: user.id,
      receiverId: admin.id,
    },
  });

  // Update balances after transfer
  await prisma.account.update({
    where: { id: userAccount.id },
    data: { balance: 1200 }, // 1500 - 300
  });

  await prisma.account.update({
    where: { id: adminAccount.id },
    data: { balance: 5300 }, // 5000 + 300
  });

  console.log('Seed data with hashed passwords and balanced transactions inserted successfully.');
  console.log('Final balances:');
  console.log(`Admin Account: ${5300}`);
  console.log(`User Account: ${1200}`);
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });