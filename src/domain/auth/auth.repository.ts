import { UserCreateFieldsDTO } from "../user/dtos";
import { User } from "../user/user.model";

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    try {
      const user = await User.findOne({ where: { email } });

      return user;
    } catch (error) {
      throw new Error("Erro ao buscar usuário");
    }
  }

  async save(userData: UserCreateFieldsDTO): Promise<void> {
    try {
      await User.create(userData as any);
    } catch (error) {
      throw new Error("Erro ao criar usuário");
    }
  }
}
