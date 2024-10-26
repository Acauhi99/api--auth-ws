import axios from "axios";
import { Request, Response } from "express";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
} from "../config";
import { AuthService } from "../domain";

interface GitHubAccessTokenResponse {
  access_token: string;
}

export class AuthController {
  private authService: AuthService;
  private githubAxios;

  constructor() {
    this.authService = new AuthService();
    this.githubAxios = axios.create({
      baseURL: "https://github.com/login/oauth",
      headers: { Accept: "application/json" },
    });
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userData = req.body;
      await this.authService.register(userData);

      return res
        .status(201)
        .json({ message: "Usuario cadastrado com sucesso!" });
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
        .json({ message: "Authorization code not provided" });
    }

    try {
      const response = await this.githubAxios.post<GitHubAccessTokenResponse>(
        "/access_token",
        {
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: GITHUB_REDIRECT_URI,
        }
      );

      const { access_token } = response.data;

      return res.status(200).json({ token: access_token });
    } catch (error) {
      return res.status(500).json({ message: "GitHub authentication failed" });
    }
  };
}
