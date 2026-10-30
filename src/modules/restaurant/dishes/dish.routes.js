const { Router } = require("express");
const multer = require("multer");
const dishController = require("./dish.controller");
const authenticate = require("../../auth/auth.middleware");

const upload = multer({ dest: "uploads/" });

const router = Router({ mergeParams: true });

// POST protegido: 'authenticate' vem ANTES do upload para barrar quem não tem token
router.post("/", authenticate, upload.single("image"), dishController.create);

// GET público: qualquer um pode listar os pratos
router.get("/", dishController.index);

// DELETE protegido: apenas usuários autenticados (e donos) podem excluir
router.delete("/:id", authenticate, dishController.remove);

module.exports = router;