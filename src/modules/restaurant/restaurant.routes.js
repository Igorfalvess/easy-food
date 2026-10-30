// src/modules/restaurant/restaurant.routes.js
const { Router } = require("express");
const restaurantController = require("./restaurant.controller");
const dishRoutes = require("./dishes/dish.routes");
const authenticate = require("../auth/auth.middleware");

const router = Router();

// Consulta pública de restaurantes
router.get("/", restaurantController.list);

// Operações de gerenciamento exigem autenticação
router.post("/", authenticate, restaurantController.create);
router.put("/:id", authenticate, restaurantController.update);
router.delete("/:id", authenticate, restaurantController.remove);

// Rotas de gerenciamento de pratos
router.use("/:restaurantId/dishes", dishRoutes);

module.exports = router;