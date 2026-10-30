
const prisma = require("../../../database/prisma");

// Valida o usuário identificado pelo token.
function getUserId(user) {
  const userId = Number(user?.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error("Usuário autenticado inválido");
    error.code = "INVALID_AUTHENTICATED_USER";
    error.status = 401;
    throw error;
  }

  return userId;
}

// Padroniza o erro de restaurante ou prato não encontrado
// ou sem autorização para acesso.
function notFoundError(message) {
  const error = new Error(message);
  error.code = "RESOURCE_NOT_FOUND_OR_FORBIDDEN";
  error.status = 404;
  return error;
}

// Verifica se o restaurante pertence ao usuário autenticado.
// Permite utilizar o Prisma normal ou uma transação existente.
async function assertRestaurantOwnership(
  restaurantId,
  user,
  database = prisma
) {
  const ownerId = getUserId(user);
  const restaurantIdNumber = Number(restaurantId);

  if (
    !Number.isInteger(restaurantIdNumber) ||
    restaurantIdNumber <= 0
  ) {
    throw notFoundError("Restaurante não encontrado");
  }

  const restaurant = await database.restaurant.findFirst({
    where: {
      id: restaurantIdNumber,
      ownerId
    }
  });

  if (!restaurant) {
    throw notFoundError("Restaurante não encontrado");
  }

  return restaurant;
}

async function createDish(restaurantId, dishData, file, user) {
  const restaurantIdNumber = Number(restaurantId);

  const { name, description, price } = dishData;

  return prisma.$transaction(async (tx) => {
    // Segunda verificação de propriedade antes do cadastro.
    const restaurant = await assertRestaurantOwnership(
      restaurantIdNumber,
      user,
      tx
    );

    console.log(
      `[EasyFood API] Prato '${name}' recebido para o restaurante ${restaurant.id}.`
    );

    if (file) {
      console.log(
        `[EasyFood API] Imagem original recebida: ${file.originalname} (${file.size} bytes).`
      );
    }

    // Cadastro do prato vinculado ao restaurante autorizado.
    const dish = await tx.dish.create({
      data: {
        name,
        description,
        price: Number(price),
        imageUrl: file
          ? `/uploads/${file.filename || file.originalname}`
          : null,
        restaurantId: restaurantIdNumber
      }
    });

    return dish;
  });
}

// Consulta pública: não exige usuário autenticado.
async function getDishesByRestaurant(restaurantId) {
  return prisma.dish.findMany({
    where: {
      restaurantId: Number(restaurantId)
    }
  });
}

async function deleteDish(restaurantId, dishId, user) {
  const ownerId = getUserId(user);

  return prisma.$transaction(async (tx) => {
    // Procura o prato somente dentro de um restaurante
    // pertencente ao usuário autenticado.
    const dish = await tx.dish.findFirst({
      where: {
        id: Number(dishId),
        restaurantId: Number(restaurantId),
        restaurant: {
          is: {
            ownerId
          }
        }
      }
    });

    if (!dish) {
      throw notFoundError("Prato não encontrado neste restaurante");
    }

    await tx.dish.delete({
      where: {
        id: dish.id
      }
    });

    return dish;
  });
}

module.exports = {
  createDish,
  getDishesByRestaurant,
  deleteDish,
  assertRestaurantOwnership
};
