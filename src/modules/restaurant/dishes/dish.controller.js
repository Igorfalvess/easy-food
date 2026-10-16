// src/modules/restaurant\dishes\dish.controller.js
const dishService = require("./dish.service");

async function create(req, res) {
  try {
    const { restaurantId } = req.params;
    const { name, description, price } = req.body;
    const file = req.file; // Arquivo recebido via multipart/form-data

    if (!name || !price) {
      return res.status(400).json({ error: "Nome e preço do prato são obrigatórios" });
    }

    const dish = await dishService.createDish(restaurantId, { name, description, price }, file);

    return res.status(201).json({
      message: "Prato cadastrado com sucesso! A imagem está sendo processada em segundo plano.",
      dish
    });
  } catch (error) {
    console.error("Erro ao cadastrar prato:", error.message);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = {
  create
};