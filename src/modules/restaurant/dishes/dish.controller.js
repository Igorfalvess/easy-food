
const dishService = require("./dish.service");
const activityService = require("../../shared/activity.service");

async function create(req, res) {
  try {
    const { restaurantId } = req.params;
    const { name, description, price } = req.body;
    const file = req.file;

    if (!name || !price) {
      return res.status(400).json({
        error: "Nome e preço do prato são obrigatórios"
      });
    }

    const dish = await dishService.createDish(
      restaurantId,
      { name, description, price },
      file,
      req.user
    );

    return res.status(201).json({
      message: "Prato cadastrado com sucesso!",
      dish
    });
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

    console.error("Erro ao cadastrar prato:", error.message);
    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function index(req, res) {
  try {
    const { restaurantId } = req.params;

    const dishes = await dishService.getDishesByRestaurant(restaurantId);

    return res.json(dishes);
  } catch (error) {
    console.error("Erro ao listar pratos:", error.message);

    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

async function remove(req, res) {
  try {
    const { restaurantId, id } = req.params;

    const dish = await dishService.deleteDish(
      restaurantId,
      id,
      req.user
    );

    // Registro da atividade após a exclusão.
    try {
      await activityService.log(
        "DISH_DELETED",
        `Prato: ${dish.name} | Restaurante ID: ${restaurantId}`
      );
    } catch (error) {
      console.error(
        "Erro ao registrar exclusão do prato:",
        error.message
      );
    }

    return res.status(204).send();
  } catch (error) {
    if (error.code === "RESOURCE_NOT_FOUND_OR_FORBIDDEN") {
      return res.status(404).json({
        error: "Prato não encontrado neste restaurante"
      });
    }

    if (error.code === "INVALID_AUTHENTICATED_USER") {
      return res.status(401).json({
        error: "Usuário autenticado inválido"
      });
    }

    console.error("Erro ao excluir prato:", error.message);

    return res.status(500).json({
      error: "Erro interno do servidor"
    });
  }
}

module.exports = {
  create,
  index,
  remove
};
