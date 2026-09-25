const restaurantService = require("./restaurant.service");

async function  list(req, res) {
    try {
    const restaurantes = await restaurantService.listRestaurants();
    res.json(restaurantes);
  } catch (error) {
    console.error("Erro ao buscar restaurantes:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function create(req, res) {
  const { name, category, rating } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Nome e categoria são obrigatórios" });
  }

  try {
    const restaurant = await restaurantService.createRestaurant(
      { name, category, rating: rating || 0 },
      req.user
    );

    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Erro ao cadastrar restaurante:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function update(req, res) {
  const { name, category, rating } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Nome e categoria são obrigatórios" });
  }

  try {
    const restaurant = await restaurantService.updateRestaurant(req.params.id, {
      name, category, rating: rating || 0
    });

    res.json(restaurant);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Restaurante não encontrado" });
    }
    console.error("Erro ao atualizar restaurante:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function remove(req, res) {
  try {
    await restaurantService.deleteRestaurant(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Restaurante não encontrado" });
    }
    console.error("Erro ao excluir restaurante:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = {list, create, update, remove};