export interface GitHubUserResponseDTO {
  id: number;
  login: string;
  name: string;
  email: string;
}

export interface GitHubUserFieldsDTO {
  firstName: string;
  lastName: string;
  email: string;
  githubId: string;
}
