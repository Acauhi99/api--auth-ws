import axios from "axios";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI,
  JWT_SECRET,
} from "../../config";
import { UserCreateFieldsDTO } from "../user/dtos";
import { AuthRepository } from "./auth.repository";

interface GitHubAccessTokenResponse {
  access_token: string;
}

export class AuthService {
  private authRepository: AuthRepository;
  private githubAxios;

  constructor() {
    this.authRepository = new AuthRepository();
    this.githubAxios = axios.create({
      baseURL: "https://github.com/login/oauth",
      headers: { Accept: "application/json" },
    });
  }

  async register(userData: UserCreateFieldsDTO): Promise<void> {
    const existingUser = await this.authRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new Error("Usuário já cadastrado");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const newUser = {
      ...userData,
      password: hashedPassword,
    };

    this.authRepository.save(newUser);
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET não definido");
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }

  async getGitHubAccessToken(code: string): Promise<string> {
    const response = await this.githubAxios.post<GitHubAccessTokenResponse>(
      "/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }
    );

    return response.data.access_token;
  }
}
