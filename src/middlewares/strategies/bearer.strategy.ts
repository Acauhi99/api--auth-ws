import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
import { AuthStrategy } from "./auth.strategy";

export interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
  password: string;
}

export class BearerStrategy implements AuthStrategy {
  async authenticate(token: string): Promise<DecodedToken> {
    return jwt.verify(token, JWT_SECRET as string) as DecodedToken;
  }
}
