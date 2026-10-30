const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../../database/prisma");

const JWT_SECRET = process.env.JWT_SECRET;

async function login({ email, password }) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return null; // usuário não existe
    }

    const senhaConfere = await bcrypt.compare(password, user.password);

    if (!senhaConfere) {
      return null; // senha errada
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET não está definido nas variáveis de ambiente (.env)");
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error("ERRO DETALHADO NO LOGIN (Service):", error);
    throw error;
  }
}

async function register({ name, email, password }) {
  try {
    const existente = await prisma.user.findUnique({ where: { email } });
    if (!JWT_SECRET) {
    throw new Error("JWT_SECRET não está definido nas variáveis de ambiente (.env)");
    }

    if (existente) {
      return null; // email já cadastrado
    }

    const senhaEmbaralhada = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: senhaEmbaralhada
      }
    });


    const token = jwt.sign(
      { sub: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  } catch (error) {
    console.error("ERRO DETALHADO NO REGISTER (Service):", error);
    throw error;
  }
}

module.exports = { login, register };