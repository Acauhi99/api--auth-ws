import { Router } from "express";
import { UserController } from "../controller";
import { asyncHandler } from "../middlewares/asyncHandler";

const userRoutes = Router();
const userController = new UserController();

userRoutes.get("/", asyncHandler(userController.getAllUsers));
userRoutes.get("/:id", asyncHandler(userController.getUserById));
userRoutes.patch("/:id", asyncHandler(userController.patchUser));
userRoutes.put("/:id", asyncHandler(userController.updateUser));
userRoutes.delete("/:id", asyncHandler(userController.deleteUser));

export default userRoutes;
