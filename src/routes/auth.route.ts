import { Router } from "express";
import { AuthController } from "../controller";
import { asyncHandler } from "../middlewares";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/register", asyncHandler(authController.register));
authRouter.post("/login", asyncHandler(authController.login));

authRouter.get("/github", asyncHandler(authController.githubAuth));
authRouter.get("/github/callback", asyncHandler(authController.githubCallback));

export { authRouter };
