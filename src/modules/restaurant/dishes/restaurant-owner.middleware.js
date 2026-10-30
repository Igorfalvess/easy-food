
const dishService = require("./dish.service");

async function authorizeRestaurantOwner(req, res, next) {
  try {
    await dishService.assertRestaurantOwnership(
      req.params.restaurantId,
      req.user
    );

    return next();
  } catch (error) {
    if (error.code === "RESOURCE_NOT_FOUND_OR_FORBIDDEN") {
      return res.status(404).json({
        error: "Restaurante não encontrado"
      });
    }

    if (error.code === "INVALID_AUTHENTICATED_USER") {
      return res.status(401).json({
        error: "Usuário autenticado inválido"
      });
    }

    console.error(
      "Erro ao verificar propriedade do restaurante:",
      error.message
    );

    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

module.exports = authorizeRestaurantOwner;
