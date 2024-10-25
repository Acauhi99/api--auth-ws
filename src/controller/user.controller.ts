import { Request, Response } from "express";
import { UserService } from "../domain";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    try {
      const users = await this.userService.getAllUsers();

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  patchUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await this.userService.patchUser(userId, updatedData);

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedUser = await this.userService.updateUser(
        userId,
        updatedData
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.params.id;
      const userDeleted = await this.userService.deleteUser(userId);

      if (!userDeleted) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };
}
