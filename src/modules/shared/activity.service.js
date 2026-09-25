const prisma = require("../../database/prisma");

/**
 * Registra uma atividade/log da aplicação.
 * @param {string} action      — identificador curto do evento, ex: "RESTAURANT_CREATED"
 * @param {string} description — detalhe legível do que aconteceu
 */
async function log(action, description) {
  await prisma.activity.create({
    data: { action, description }
  });

  console.log(`[ACTIVITY] ${action} — ${description}`);
}

module.exports = { log };