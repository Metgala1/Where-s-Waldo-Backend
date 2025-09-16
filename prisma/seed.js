const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Create a Rick & Morty scene
  const image = await prisma.image.create({
    data: {
      title: "Rick and Morty Scene",
      url: "https://example.com/rick-and-morty-scene.jpg", // replace with actual image URL
      width: 1920,
      height: 1080,
    },
  });

  console.log("Created image:", image);

  // 2. Add characters from the scene
  const characters = [
    { name: "Rick", x: 350, y: 220, width: 40, height: 40 },
    { name: "Morty", x: 800, y: 450, width: 40, height: 40 },
    { name: "Summer", x: 1200, y: 600, width: 40, height: 40 },
    { name: "Beth", x: 600, y: 300, width: 40, height: 40 },
    { name: "Jerry", x: 1000, y: 500, width: 40, height: 40 },
    { name: "Mr. Poopybutthole", x: 1400, y: 700, width: 40, height: 40 },
    { name: "Birdperson", x: 1600, y: 800, width: 40, height: 40 },
  ];

  for (const char of characters) {
    const character = await prisma.character.create({
      data: {
        ...char,
        imageId: image.id,
      },
    });
    console.log("Created character:", character.name);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
