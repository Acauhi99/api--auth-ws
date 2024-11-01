export interface UserCreateFieldsDTO {
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  birthDate?: Date;
  githubId?: string;
  avatarUrl?: string;
}
