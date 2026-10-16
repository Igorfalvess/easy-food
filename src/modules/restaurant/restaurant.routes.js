// src/modules/restaurant/restaurant.routes.js
const { Router } = require("express");
const restaurantController = require("./restaurant.controller");
const dishRoutes = require("./dishes/dish.routes");

const router = Router();

// Rotas de Restaurantes
router.get("/", restaurantController.list);
router.post("/", restaurantController.create);
router.put("/:id", restaurantController.update);
router.delete("/:id", restaurantController.remove);

// Redireciona as rotas de pratos para o subdomínio de pratos
router.use("/:restaurantId/dishes", dishRoutes);

module.exports = router;