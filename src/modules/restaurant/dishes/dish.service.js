// src/modules/restaurant/dishes/dish.service.js
const prisma = require("../../../database/prisma");

async function createDish(restaurantId, dishData, file) {
  const { name, description, price } = dishData;

  console.log(`[EasyFood API] Prato '${name}' recebido para o restaurante ${restaurantId}.`);
  if (file) {
    console.log(`[EasyFood API] Imagem original recebida: ${file.originalname} (${file.size} bytes). Encaminhando para storage...`);
  }

  // Persistência real usando o Prisma no banco de dados relacional
  const dish = await prisma.dish.create({
    data: {
      name,
      description,
      price: Number(price),
      imageUrl: file ? `/uploads/${file.filename || file.originalname}` : null,
      restaurantId: Number(restaurantId) // Ajuste para string se seu ID for UUID no schema.prisma
    }
  });

  return dish;
}

async function getDishesByRestaurant(restaurantId) {
  // Busca real dos pratos associados ao restaurante no banco
  return await prisma.dish.findMany({
    where: {
      restaurantId: Number(restaurantId) // Ajuste para string se seu ID for UUID
    }
  });
}

async function deleteDish(restaurantId, dishId) {
  const dish = await prisma.dish.findFirst({
    where: {
      id: Number(dishId),
      restaurantId: Number(restaurantId)
    }
  });

  if (!dish) {
    const error = new Error("Prato não encontrado neste restaurante");
    error.status = 404;
    throw error;
  }

  await prisma.dish.delete({
    where: {
      id: dish.id
    }
  });

  return dish;
}

module.exports = {
  createDish,
  getDishesByRestaurant,
  deleteDish
};