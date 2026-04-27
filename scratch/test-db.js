const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.menuCategories.count();
    console.log(`Connection successful! Total MenuCategories: ${count}`);
    const categories = await prisma.menuCategories.findMany({ take: 5 });
    console.log('Categories:', categories);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
