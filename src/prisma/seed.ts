import { PrismaClient } from '@prisma/client';

import { comments, orders, pets, reviews, sitters, tasks, users } from './data';

const prisma = new PrismaClient();

export const seedDatabase = async () => {
  try {
    await prisma.comment.deleteMany();
    console.log('Deleted records in comment table');

    await prisma.review.deleteMany();
    console.log('Deleted records in review table');

    await prisma.order.deleteMany();
    console.log('Deleted records in order table');

    await prisma.task.deleteMany();
    console.log('Deleted records in task table');

    await prisma.sitter.deleteMany();
    console.log('Deleted records in sitter table');

    await prisma.pet.deleteMany();
    console.log('Deleted records in pet table');

    await prisma.user.deleteMany();
    console.log('Deleted records in user table');

    await prisma.user.createMany({
      data: users,
    });
    console.log('Added user data');

    await prisma.pet.createMany({
      data: pets,
    });
    console.log('Added pet data');

    await prisma.task.createMany({
      data: tasks,
    });
    console.log('Added task data');

    await prisma.comment.createMany({
      data: comments,
    });
    console.log('Added comment data');

    await prisma.sitter.createMany({
      data: sitters,
    });
    console.log('Added sitter data');

    await prisma.review.createMany({
      data: reviews,
    });
    console.log('Added review data');

    await prisma.order.createMany({
      data: orders,
    });
    console.log('Added order data');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

// 如果這個文件是直接執行的，那麼執行 seedDatabase 函數
if (require.main === module) {
  seedDatabase();
}
