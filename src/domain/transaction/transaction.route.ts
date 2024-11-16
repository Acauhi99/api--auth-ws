import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const transactionRouter = Router();
const transactionController = new TransactionController();

transactionRouter.use(authenticateHandler);

transactionRouter.get("/", asyncHandler(transactionController.getTransactions));
transactionRouter.post(
  "/stocks/buy",
  asyncHandler(transactionController.buyStock)
);
transactionRouter.post(
  "/stocks/sell",
  asyncHandler(transactionController.sellStock)
);
transactionRouter.post("/deposit", asyncHandler(transactionController.deposit));
transactionRouter.post(
  "/withdraw",
  asyncHandler(transactionController.withdraw)
);

export { transactionRouter };
