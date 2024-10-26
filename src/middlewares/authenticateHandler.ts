import axios from "axios";
import { RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  password: string;
}

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email?: string;
}

export const authenticateHandler: RequestHandler = async (req, res, next) => {
  const githubUrl = "https://api.github.com/user";

  const authHeader = req.header("Authorization");
  if (!authHeader) {
    res.status(401).json({ message: "Token not provided" });
    return;
  }

  const [scheme, token] = authHeader.split(" ");
  if (!token) {
    res.status(401).json({ message: "Token format invalid" });
    return;
  }

  try {
    if (scheme === "Bearer") {
      const decoded = jwt.verify(token, JWT_SECRET as string) as DecodedToken;
      req.user = decoded;
      return next();
    } else if (scheme === "GitHub") {
      const githubResponse = await axios.get<GithubUser>(githubUrl, {
        headers: { Authorization: `token ${token}` },
      });

      req.user = githubResponse.data;

      return next();
    } else {
      res.status(401).json({ message: "Invalid authentication scheme" });
      return;
    }
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
};
