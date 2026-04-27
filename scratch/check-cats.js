const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.product.findMany({
    select: { category: true },
    distinct: ['category']
  });
  console.log("Categories in DB:", JSON.stringify(categories, null, 2));
  
  const count = await prisma.product.count();
  console.log("Total products count:", count);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
