import { DecodedToken } from "./middlewares";

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedToken;
  }
}
