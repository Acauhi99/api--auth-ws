import { Router } from "express";
import { StockController } from "./stock.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const stockRouter = Router();
const stockController = new StockController();

stockRouter.get(
  "/market/available",
  asyncHandler(stockController.getAvailableStocks)
);
stockRouter.get("/market/:ticker", asyncHandler(stockController.getStockInfo));

export { stockRouter };
