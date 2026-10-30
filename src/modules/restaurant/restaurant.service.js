
const prisma = require("../../database/prisma");
const emailService = require("../shared/email.service");
const activityService = require("../shared/activity.service");

const COMERCIAL_EMAIL = process.env.COMERCIAL_EMAIL;

// Padroniza o erro quando o restaurante não existe
// ou não pertence ao usuário autenticado.
function restaurantNotFoundError() {
  const error = new Error("Restaurante não encontrado");
  error.code = "RESTAURANT_NOT_FOUND_OR_FORBIDDEN";
  return error;
}

// Valida e converte o ID do usuário autenticado.
function getUserId(user) {
  const userId = Number(user?.id);

  if (!Number.isInteger(userId) || userId <= 0) {
    const error = new Error("Usuário autenticado inválido");
    error.code = "INVALID_AUTHENTICATED_USER";
    throw error;
  }

  return userId;
}

async function listRestaurants() {
  return prisma.restaurant.findMany();
}

async function createRestaurant(data, user) {
  const ownerId = getUserId(user);

  // O restaurante é cadastrado vinculado ao usuário autenticado.
  // O ownerId não vem do formulário: vem do token.
  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name,
      category: data.category,
      rating: data.rating || 0,
      ownerId
    }
  });

  // E-mail de boas-vindas para o responsável pelo restaurante.
  try {
    await emailService.sendEmail({
      to: user.email,
      toName: restaurant.name,
      subject: `Bem-vindo à EasyFood, ${restaurant.name}!`,
      header: `Olá, ${restaurant.name}!`,
      body: `Seu restaurante foi cadastrado com sucesso na EasyFood. Categoria: ${restaurant.category}.`,
      footer: "Equipe EasyFood"
    });
  } catch (error) {
    console.error("Erro ao enviar e-mail de boas-vindas:", error.message);
  }

  // Registro da atividade.
  try {
    await activityService.log(
      "RESTAURANT_CREATED",
      `Restaurante: ${restaurant.name}`
    );
  } catch (error) {
    console.error("Erro ao registrar atividade:", error.message);
  }

  // Alerta para o comercial.
  try {
    await emailService.sendEmail({
      to: COMERCIAL_EMAIL,
      toName: "Comercial EasyFood",
      subject: `Novo restaurante cadastrado: ${restaurant.name}`,
      header: "Novo restaurante na plataforma",
      body: `Nome: ${restaurant.name}<br/>Categoria: ${restaurant.category}<br/>Avaliação: ${restaurant.rating}`,
      footer: "Notificação automática — EasyFood"
    });
  } catch (error) {
    console.error("Erro ao notificar o comercial:", error.message);
  }

  return restaurant;
}

async function updateRestaurant(id, data, user) {
  const ownerId = getUserId(user);
  const restaurantId = Number(id);

  return prisma.$transaction(async (tx) => {
    // Atualiza somente se o restaurante pertencer ao usuário.
    const result = await tx.restaurant.updateMany({
      where: {
        id: restaurantId,
        ownerId
      },
      data: {
        name: data.name,
        category: data.category,
        rating: data.rating || 0
      }
    });

    if (result.count === 0) {
      throw restaurantNotFoundError();
    }

    return tx.restaurant.findUnique({
      where: { id: restaurantId }
    });
  });
}

async function deleteRestaurant(id, user) {
  const ownerId = getUserId(user);

  // A exclusão considera simultaneamente o ID do restaurante
  // e o ID do proprietário.
  const result = await prisma.restaurant.deleteMany({
    where: {
      id: Number(id),
      ownerId
    }
  });

  if (result.count === 0) {
    throw restaurantNotFoundError();
  }

  return result;
}

module.exports = {
  listRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant
};
