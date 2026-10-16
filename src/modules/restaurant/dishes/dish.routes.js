// src/modules/restaurant/dishes/dish.routes.js
const { Router } = require("express");
const multer = require("multer");
const dishController = require("./dish.controller");

// Configuração básica do multer (armazenamento temporário na memória ou disco)
const upload = multer({ dest: "uploads/" });

const router = Router({ mergeParams: true }); // mergeParams permite acessar o restaurantId vindo da rota pai

// Rota para cadastrar um prato com imagem: POST /restaurants/:restaurantId/dishes
router.post("/", upload.single("image"), dishController.create);

module.exports = router;