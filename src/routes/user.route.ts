import { Router } from "express";
import { UserController } from "../controller";
import { asyncHandler, authenticateHandler } from "../middlewares";

const userRoutes = Router();
const userController = new UserController();

userRoutes.use(authenticateHandler);

userRoutes.get("/", asyncHandler(userController.getAllUsers));
userRoutes.get("/:id", asyncHandler(userController.getUserById));
userRoutes.patch("/:id", asyncHandler(userController.patchUser));
userRoutes.put("/:id", asyncHandler(userController.updateUser));
userRoutes.delete("/:id", asyncHandler(userController.deleteUser));

export { userRoutes };
