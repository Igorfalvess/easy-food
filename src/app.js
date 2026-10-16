
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./modules/auth/auth.routes");
const restaurantRoutes = require("./modules/restaurant/restaurant.routes");

const app = express();


app.use(cors());
app.use(express.json());

// Disponibiliza os arquivos do frontend
app.use(express.static(path.join(__dirname, "../public")));

// Disponibiliza as imagens enviadas dos pratos
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

// Rotas da API
app.use("/auth", authRoutes);
app.use("/restaurants", restaurantRoutes);

module.exports = app;
