"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = require("express");
const transaction_controller_1 = require("./transaction.controller");
const middlewares_1 = require("../../middlewares");
const transactionRouter = (0, express_1.Router)();
exports.transactionRouter = transactionRouter;
const transactionController = new transaction_controller_1.TransactionController();
transactionRouter.use(middlewares_1.authenticateHandler);
// Stock operations
transactionRouter.post("/stock/buy", (0, middlewares_1.asyncHandler)(transactionController.buyStock));
transactionRouter.post("/stock/sell", (0, middlewares_1.asyncHandler)(transactionController.sellStock));
// Money operations
transactionRouter.post("/deposit", (0, middlewares_1.asyncHandler)(transactionController.deposit));
transactionRouter.post("/withdraw", (0, middlewares_1.asyncHandler)(transactionController.withdraw));
// History
transactionRouter.get("/history", (0, middlewares_1.asyncHandler)(transactionController.getTransactionHistory));