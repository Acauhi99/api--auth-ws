"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.portfolioRouter = exports.transactionRouter = exports.stockRouter = exports.dividendRouter = exports.userRouter = exports.authRouter = void 0;
var auth_route_1 = require("./auth/auth.route");
Object.defineProperty(exports, "authRouter", { enumerable: true, get: function () { return auth_route_1.authRouter; } });
var user_route_1 = require("./user/user.route");
Object.defineProperty(exports, "userRouter", { enumerable: true, get: function () { return user_route_1.userRouter; } });
var dividend_route_1 = require("./dividend/dividend.route");
Object.defineProperty(exports, "dividendRouter", { enumerable: true, get: function () { return dividend_route_1.dividendRouter; } });
var stock_route_1 = require("./stock/stock.route");
Object.defineProperty(exports, "stockRouter", { enumerable: true, get: function () { return stock_route_1.stockRouter; } });
var transaction_route_1 = require("./transaction/transaction.route");
Object.defineProperty(exports, "transactionRouter", { enumerable: true, get: function () { return transaction_route_1.transactionRouter; } });
var portfolio_route_1 = require("./portfolio/portfolio.route");
Object.defineProperty(exports, "portfolioRouter", { enumerable: true, get: function () { return portfolio_route_1.portfolioRouter; } });
