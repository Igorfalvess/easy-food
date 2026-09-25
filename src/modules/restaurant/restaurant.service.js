const prisma = require("../../database/prisma");
const emailService = require("../shared/email.service");
const activityService = require("../shared/activity.service");

const COMERCIAL_EMAIL = process.env.COMERCIAL_EMAIL;

async function listRestaurants() {
  return prisma.restaurant.findMany();
}

async function createRestaurant(data, user) {
  // 1) O que realmente importa: cadastrar o restaurante
  const restaurant = await prisma.restaurant.create({
    data: {
      name: data.name,
      category: data.category,
      rating: data.rating || 0
    }
  });

  // 2) Ações secundárias — cada uma isolada por try/catch.
  //    Se qualquer uma falhar, o cadastro NÃO é afetado.

  // E-mail de boas-vindas (pro dono do restaurante, vindo do token)
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

  // Registro da atividade
  try {
    await activityService.log("RESTAURANT_CREATED", `Restaurante: ${restaurant.name}`);
  } catch (error) {
    console.error("Erro ao registrar atividade:", error.message);
  }

  // Alerta para o comercial (mesma função genérica, outro conteúdo)
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

  // 3) O restaurante volta independente do resultado das ações acima
  return restaurant;
}

async function updateRestaurant(id, data) {
  return prisma.restaurant.update({
    where: { id: Number(id) },
    data: { name: data.name, category: data.category, rating: data.rating || 0 }
  });
}

async function deleteRestaurant(id) {
  return prisma.restaurant.delete({ where: { id: Number(id) } });
}

module.exports = { listRestaurants, createRestaurant, updateRestaurant, deleteRestaurant };