import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const transactionRouter = Router();
const transactionController = new TransactionController();

transactionRouter.use(authenticateHandler);

// Stock operations
transactionRouter.post(
  "/stock/buy",
  asyncHandler(transactionController.buyStock)
);
transactionRouter.post(
  "/stock/sell",
  asyncHandler(transactionController.sellStock)
);

// Money operations
transactionRouter.post("/deposit", asyncHandler(transactionController.deposit));
transactionRouter.post(
  "/withdraw",
  asyncHandler(transactionController.withdraw)
);

// History
transactionRouter.get(
  "/history",
  asyncHandler(transactionController.getTransactionHistory)
);

export { transactionRouter };
