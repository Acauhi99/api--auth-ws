import { Request, Response } from "express";
import { AuthService } from "../domain";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userData = req.body;
      const newUser = await this.authService.register(userData);

      return res.status(201).json(newUser);
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
}
