import { Request, Response } from "express";
import { UserService } from "../domain";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await this.userService.getAllUsers();

    return res.status(200).json(users);
  };

  getUserById = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    const user = await this.userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json(user);
  };

  patchUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await this.userService.patchUser(userId, updatedData);

    return res.status(200).json(updatedUser);
  };

  updateUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await this.userService.updateUser(userId, updatedData);

    return res.status(200).json(updatedUser);
  };

  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const userId = req.params.id;
    await this.userService.deleteUser(userId);

    return res.status(204).send();
  };
}
