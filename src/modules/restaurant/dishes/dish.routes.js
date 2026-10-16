// src/modules/restaurant/dishes/dish.routes.js
const { Router } = require("express");
const multer = require("multer");
const dishController = require("./dish.controller");
const authenticate = require("../../auth/auth.middleware");

// Configuração básica do multer (armazenamento temporário na memória ou disco)
const upload = multer({ dest: "uploads/" });

const router = Router({ mergeParams: true }); // mergeParams permite acessar o restaurantId vindo da rota pai

// Rotas para gerenciar pratos do restaurante
router.post("/", upload.single("image"), dishController.create);
router.get("/", dishController.index); // <--- Esta linha faltava e vai buscar os pratos!
router.delete("/:id", authenticate, dishController.remove);

module.exports = router;