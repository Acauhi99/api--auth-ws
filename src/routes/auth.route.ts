import { Router } from "express";
import { AuthController } from "../controller";
import { asyncHandler } from "../middlewares/asyncHandler";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/register", asyncHandler(authController.register));
authRoutes.post("/login", asyncHandler(authController.login));

authRoutes.get("/github", asyncHandler(authController.githubAuth));
authRoutes.get("/github/callback", asyncHandler(authController.githubCallback));

export { authRoutes };
