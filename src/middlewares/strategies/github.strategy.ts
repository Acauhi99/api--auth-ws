import axios from "axios";
import { AuthStrategy } from "./auth.strategy";

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email?: string;
}

export class GitHubStrategy implements AuthStrategy {
  async authenticate(token: string): Promise<GithubUser> {
    const githubUrl = "https://api.github.com/user";

    const response = await axios.get<GithubUser>(githubUrl, {
      headers: { Authorization: `token ${token}` },
    });

    return response.data;
  }
}
