const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: "Modern Crystal Chandelier",
      article: "LUM-101",
      brand: "Lumina Elite",
      price: 125000,
      discountPrice: 95000,
      category: "Chandeliers",
      style: "modern",
      room: "living room,bedroom",
      color: "chrome",
      lightColor: "4000K",
      power: 60,
      mounting: "ceiling",
      images: JSON.stringify(["/images/products/chandelier.png"]),
      stock: 15,
      luminousFlux: 4200,
      dimensions: JSON.stringify({ length: 800, width: 800, height: 1200 }),
      description: "Элегантная люстра с хрустальными элементами для просторных гостиных.",
      finish: "Chrome / Glass",
    },
    {
      name: "Vintage Brass Wall Sconce",
      article: "LUM-202",
      brand: "Vintage Glow",
      price: 45000,
      category: "Wall lights",
      style: "classic",
      room: "hallway,bedroom",
      color: "gold",
      lightColor: "2700K",
      power: 15,
      mounting: "wall",
      images: JSON.stringify(["/images/products/sconce.png"]),
      stock: 24,
      luminousFlux: 850,
      dimensions: JSON.stringify({ length: 150, width: 220, height: 350 }),
      description: "Настенное бра в классическом стиле с латунным покрытием.",
      finish: "Antique Brass",
    },
    {
      name: "Loft Industrial Pendant",
      article: "LUM-303",
      brand: "Urban Light",
      price: 32000,
      category: "Pendant",
      style: "loft",
      room: "kitchen,hallway",
      color: "black",
      lightColor: "4000K",
      power: 40,
      mounting: "pendant",
      images: JSON.stringify(["/images/products/pendant.png"]),
      stock: 40,
      luminousFlux: 2400,
      dimensions: JSON.stringify({ length: 300, width: 300, height: 450 }),
      description: "Подвесной светильник в стиле лофт для современного интерьера.",
      finish: "Matte Black",
    },
    {
      name: "Minimalist Recessed Spot",
      article: "LUM-404",
      brand: "Pure Lighting",
      price: 8500,
      category: "Recessed",
      style: "minimalism",
      room: "bathroom,kitchen",
      color: "white",
      lightColor: "6000K",
      power: 7,
      mounting: "recessed",
      images: JSON.stringify(["/images/products/spot.png"]),
      stock: 120,
      luminousFlux: 600,
      dimensions: JSON.stringify({ length: 85, width: 85, height: 60 }),
      description: "Минималистичный встраиваемый светильник с высокой защитой от влаги.",
      finish: "White Polymer",
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { article: product.article },
      update: product,
      create: product,
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
