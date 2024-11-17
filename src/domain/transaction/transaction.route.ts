import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const transactionRouter = Router();
const transactionController = new TransactionController();

transactionRouter.use(authenticateHandler);

transactionRouter.post(
  "/stock/buy",
  asyncHandler(transactionController.buyStock)
);
transactionRouter.post(
  "/stock/sell",
  asyncHandler(transactionController.sellStock)
);

transactionRouter.post("/deposit", asyncHandler(transactionController.deposit));
transactionRouter.post(
  "/withdraw",
  asyncHandler(transactionController.withdraw)
);

transactionRouter.get(
  "/history",
  asyncHandler(transactionController.getTransactionHistory)
);

export { transactionRouter };
