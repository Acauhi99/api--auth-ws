import { Request, Response } from "express";
import { AuthService } from "../domain/auth/auth.service";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    const userData = req.body;
    const newUser = await this.authService.register(userData);

    return res.status(201).json(newUser);
  };

  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;
    const token = await this.authService.login(email, password);

    return res.status(200).json({ token });
  };
}
