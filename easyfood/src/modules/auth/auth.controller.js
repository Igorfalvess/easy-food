const authService = require("./auth.service");

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  try {
    const result = await authService.login({ email, password });

    if (!result) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    res.json(result);
  } catch (error) {
    console.error("Erro ao fazer login:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function register(req, res) {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios" });
  }

  try {
    const result = await authService.register({ name, email, password });

    if (!result) {
      return res.status(409).json({ error: "Email já cadastrado" });
    }

    res.status(201).json(result);
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

module.exports = { login, register };