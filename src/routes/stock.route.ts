import { Router } from "express";
import { StockController } from "../controller";
import { asyncHandler } from "../middlewares";

const stockRouter = Router();
const stockController = new StockController();

stockRouter.get("/", asyncHandler(stockController.getAllStocks));
stockRouter.get("/available", asyncHandler(stockController.getAvailableStocks));
stockRouter.get("/quote/:tickers", asyncHandler(stockController.getQuotes));
stockRouter.get("/:id", asyncHandler(stockController.getStockById));
stockRouter.post("/", asyncHandler(stockController.createStock));
stockRouter.get(
  "/quote/single/:ticker",
  asyncHandler(stockController.getStockQuote)
);

export { stockRouter };
