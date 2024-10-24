import { UserCreateFieldsDTO } from "./dtos";
import { User } from "./user.model";
import { UserRepository } from "./user.repository";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(userId: string): Promise<User | null> {
    return this.userRepository.getUserById(userId);
  }

  async patchUser(
    userId: string,
    updatedData: Partial<UserCreateFieldsDTO>
  ): Promise<User | null> {
    return this.userRepository.patchUser(userId, updatedData);
  }

  async updateUser(
    userId: string,
    updatedData: UserCreateFieldsDTO
  ): Promise<User | null> {
    return this.userRepository.updateUser(userId, updatedData);
  }

  async deleteUser(userId: string): Promise<void> {
    return this.userRepository.deleteUser(userId);
  }
}
