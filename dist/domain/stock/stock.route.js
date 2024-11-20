"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stockRouter = void 0;
const express_1 = require("express");
const stock_controller_1 = require("./stock.controller");
const middlewares_1 = require("../../middlewares");
const stockRouter = (0, express_1.Router)();
exports.stockRouter = stockRouter;
const stockController = new stock_controller_1.StockController();
stockRouter.get("/market/available", (0, middlewares_1.asyncHandler)(stockController.getAvailableStocks));
stockRouter.get("/market/:ticker", (0, middlewares_1.asyncHandler)(stockController.getStockInfo));
