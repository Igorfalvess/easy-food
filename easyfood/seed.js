const prisma = require('./src/database/prisma');

const restaurants = [
  { name: "Sabor do Brasil", category: "Brasileira", rating: 4.8 },
  { name: "Bella Italia", category: "Italiana", rating: 4.5 },
  { name: "Taverna Portuguesa", category: "Portuguesa", rating: 4.7 },
  { name: "Burger House", category: "Hamburgueria", rating: 4.2 },
  { name: "Sushi Express", category: "Japonesa", rating: 4.6 }
];

async function main() {
  console.log("Inserindo restaurantes...");
  for (const restaurant of restaurants) {
    await prisma.restaurant.create({
      data: restaurant
    });
  }
  console.log("Restaurantes inseridos com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });