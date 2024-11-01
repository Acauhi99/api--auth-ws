import { RequestHandler } from "express";
import { AuthStrategy, BearerStrategy, GitHubStrategy } from "./strategies";

const strategies: { [key: string]: AuthStrategy } = {
  Bearer: new BearerStrategy(),
  GitHub: new GitHubStrategy(),
};

export const authenticateHandler: RequestHandler = async (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  const [scheme, token] = authHeader.split(" ");
  if (!token) {
    res.status(401).json({ message: "Formato de token inválido" });
    return;
  }

  const strategy = strategies[scheme];
  if (!strategy) {
    res.status(401).json({ message: "Esquema de autenticação inválido" });
    return;
  }

  try {
    const user = await strategy.authenticate(token);

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado" });
  }
};
