import { UserCreateFieldsDTO } from "./dtos";
import { User } from "./user.model";

export class UserRepository {
  async getAllUsers(): Promise<User[]> {
    try {
      return await User.findAll();
    } catch (error) {
      throw new Error("Erro ao buscar usuários");
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      return await User.findByPk(userId);
    } catch (error) {
      throw new Error("Usuário não encontrado");
    }
  }

  async patchUser(
    userId: string,
    updatedData: Partial<UserCreateFieldsDTO>
  ): Promise<User | null> {
    try {
      const user = await User.findByPk(userId);

      if (!user) return null;

      await user.update(updatedData);

      return user;
    } catch (error) {
      throw new Error("Erro ao atualizar usuário");
    }
  }

  async updateUser(
    userId: string,
    updatedData: UserCreateFieldsDTO
  ): Promise<User | null> {
    try {
      const user = await User.findByPk(userId);

      if (!user) return null;

      await user.update(updatedData);

      return user;
    } catch (error) {
      throw new Error("Erro ao atualizar usuário");
    }
  }

  async deleteUser(userId: string): Promise<boolean> {
    try {
      const user = await User.findByPk(userId);

      if (!user) return false;

      await user.destroy();

      return true;
    } catch (error) {
      throw new Error("Erro ao deletar usuário");
    }
  }
}
