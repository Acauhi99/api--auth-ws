import { Router } from "express";
import { StockController } from "../controller";
import { asyncHandler } from "../middlewares";

const stockRouter = Router();
const stockController = new StockController();

stockRouter.get("/", asyncHandler(stockController.getAllStocks));
stockRouter.get("/:id", asyncHandler(stockController.getStockById));
stockRouter.get("/quote/:ticker", asyncHandler(stockController.getStockQuote));

export { stockRouter };
