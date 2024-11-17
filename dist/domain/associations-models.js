"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = exports.Transaction = exports.Stock = exports.Portfolio = exports.User = void 0;
const sequelize_1 = require("../sequelize");
Object.defineProperty(exports, "sequelize", { enumerable: true, get: function () { return sequelize_1.sequelize; } });
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const portfolio_1 = require("./portfolio");
Object.defineProperty(exports, "Portfolio", { enumerable: true, get: function () { return portfolio_1.Portfolio; } });
const stock_1 = require("./stock");
Object.defineProperty(exports, "Stock", { enumerable: true, get: function () { return stock_1.Stock; } });
const transaction_1 = require("./transaction");
Object.defineProperty(exports, "Transaction", { enumerable: true, get: function () { return transaction_1.Transaction; } });
user_1.User.initModel(sequelize_1.sequelize);
portfolio_1.Portfolio.initModel(sequelize_1.sequelize);
stock_1.Stock.initModel(sequelize_1.sequelize);
transaction_1.Transaction.initModel(sequelize_1.sequelize);
// User & Portfolio
user_1.User.hasOne(portfolio_1.Portfolio, { foreignKey: "userId", as: "portfolio" });
portfolio_1.Portfolio.belongsTo(user_1.User, { foreignKey: "userId", as: "user" });
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
stock_1.Stock.hasMany(transaction_1.Transaction, {
    foreignKey: "ticker",
    sourceKey: "ticker",
    as: "transactions",
});
transaction_1.Transaction.belongsTo(stock_1.Stock, {
    foreignKey: "ticker",
    targetKey: "ticker",
    as: "stock",
});
