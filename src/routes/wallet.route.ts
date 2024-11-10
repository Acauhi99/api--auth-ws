import { Router } from "express";
import { WalletController } from "../controller";
import { asyncHandler, authenticateHandler } from "../middlewares";

const walletRouter = Router();
const walletController = new WalletController();

walletRouter.use(authenticateHandler);

walletRouter.get("/", asyncHandler(walletController.getWallet));
walletRouter.post("/deposit", asyncHandler(walletController.deposit));
walletRouter.post("/withdraw", asyncHandler(walletController.withdraw));
walletRouter.get(
  "/profitability",
  asyncHandler(walletController.getProfitability)
);

export { walletRouter };
