import { Request, Response } from "express";
import { GITHUB_CLIENT_ID, GITHUB_REDIRECT_URI } from "../config";
import { AuthService } from "../domain";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userData = req.body;
      await this.authService.register(userData);

      return res
        .status(201)
        .json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);

      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ message: (error as Error).message });
    }
  };

  githubAuth = async (_: Request, res: Response): Promise<void> => {
    const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${GITHUB_REDIRECT_URI}`;
    res.redirect(githubAuthURL);
  };

  githubCallback = async (req: Request, res: Response): Promise<Response> => {
    const { code } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Código de autorização não fornecido" });
    }

    try {
      const token = await this.authService.loginWithGitHub(code as string);
      return res.status(200).json({ token });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Falha na autenticação do GitHub" });
    }
  };
}
