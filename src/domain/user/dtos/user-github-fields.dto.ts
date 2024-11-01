export interface GitHubUserResponseDTO {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
}

export interface GitHubUserFieldsDTO {
  firstName: string;
  lastName: string;
  email: string;
  githubId: string;
  avatarUrl: string;
}
