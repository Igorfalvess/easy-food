
const { Router } = require("express");
const multer = require("multer");
const dishController = require("./dish.controller");
const authenticate = require("../../auth/auth.middleware");
const authorizeRestaurantOwner = require("./restaurant-owner.middleware");

const upload = multer({ dest: "uploads/" });

const router = Router({ mergeParams: true });

// Cadastro: autentica, verifica a propriedade e só então processa a imagem.
router.post(
  "/",
  authenticate,
  authorizeRestaurantOwner,
  upload.single("image"),
  dishController.create
);

// Consulta pública dos pratos.
router.get("/", dishController.index);

// Exclusão exige autenticação e validação de propriedade no Service.
router.delete("/:id", authenticate, dishController.remove);

module.exports = router;
