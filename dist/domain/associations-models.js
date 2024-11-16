"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Dividend = exports.Transaction = exports.Stock = exports.PortfolioStock = exports.Portfolio = exports.User = void 0;
const sequelize_1 = require("../sequelize");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return sequelize_1.sequelize; } });
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const portfolio_1 = require("./portfolio");
Object.defineProperty(exports, "Portfolio", { enumerable: true, get: function () { return portfolio_1.Portfolio; } });
Object.defineProperty(exports, "PortfolioStock", { enumerable: true, get: function () { return portfolio_1.PortfolioStock; } });
const stock_1 = require("./stock/");
Object.defineProperty(exports, "Stock", { enumerable: true, get: function () { return stock_1.Stock; } });
const transaction_1 = require("./transaction");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return transaction_1.Transaction; } });
const dividend_1 = require("./dividend");
Object.defineProperty(exports, "Dividend", { enumerable: true, get: function () { return dividend_1.Dividend; } });
user_1.User.initModel(sequelize_1.sequelize);
portfolio_1.Portfolio.initModel(sequelize_1.sequelize);
portfolio_1.PortfolioStock.initModel(sequelize_1.sequelize);
stock_1.Stock.initModel(sequelize_1.sequelize);
transaction_1.Transaction.initModel(sequelize_1.sequelize);
dividend_1.Dividend.initModel(sequelize_1.sequelize);
// User & Portfolio
user_1.User.hasOne(portfolio_1.Portfolio, { foreignKey: "userId", as: "portfolio" });
portfolio_1.Portfolio.belongsTo(user_1.User, { foreignKey: "userId", as: "user" });
// Portfolio & PortfolioStock
portfolio_1.Portfolio.hasMany(portfolio_1.PortfolioStock, {
    foreignKey: "portfolioId",
    as: "portfolioStocks",
});
portfolio_1.PortfolioStock.belongsTo(portfolio_1.Portfolio, {
    foreignKey: "portfolioId",
    as: "portfolio",
});
// Stock & PortfolioStock
stock_1.Stock.hasMany(portfolio_1.PortfolioStock, { foreignKey: "stockId", as: "portfolioStocks" });
portfolio_1.PortfolioStock.belongsTo(stock_1.Stock, { foreignKey: "stockId", as: "stock" });
// User & Transaction
user_1.User.hasMany(transaction_1.Transaction, { foreignKey: "userId", as: "transactions" });
transaction_1.Transaction.belongsTo(user_1.User, { foreignKey: "userId", as: "user" });
// Portfolio & Transaction
portfolio_1.Portfolio.hasMany(transaction_1.Transaction, {
    foreignKey: "portfolioId",
    as: "transactions",
});
transaction_1.Transaction.belongsTo(portfolio_1.Portfolio, {
    foreignKey: "portfolioId",
    as: "portfolio",
});
// Stock & Transaction
stock_1.Stock.hasMany(transaction_1.Transaction, { foreignKey: "stockId", as: "transactions" });
transaction_1.Transaction.belongsTo(stock_1.Stock, { foreignKey: "stockId", as: "stock" });
// Stock & Dividend
stock_1.Stock.hasMany(dividend_1.Dividend, { foreignKey: "stockId", as: "dividends" });
dividend_1.Dividend.belongsTo(stock_1.Stock, { foreignKey: "stockId", as: "stock" });
// User & Dividend
user_1.User.hasMany(dividend_1.Dividend, { foreignKey: "userId", as: "dividends" });
dividend_1.Dividend.belongsTo(user_1.User, { foreignKey: "userId", as: "user" });
// Portfolio & Dividend
portfolio_1.Portfolio.hasMany(dividend_1.Dividend, { foreignKey: "portfolioId", as: "dividends" });
dividend_1.Dividend.belongsTo(portfolio_1.Portfolio, { foreignKey: "portfolioId", as: "portfolio" });
