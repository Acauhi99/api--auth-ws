import { Router } from "express";
import { UserController } from "./user.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const userRouter = Router();
const userController = new UserController();

userRouter.use(authenticateHandler);

userRouter.get("/", asyncHandler(userController.getAllUsers));
userRouter.get("/:id", asyncHandler(userController.getUserById));
userRouter.patch("/:id", asyncHandler(userController.patchUser));
userRouter.put("/:id", asyncHandler(userController.updateUser));
userRouter.delete("/:id", asyncHandler(userController.deleteUser));

export { userRouter };
