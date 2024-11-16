import { sequelize } from "../sequelize";
import { User } from "./user";
import { Portfolio, PortfolioStock } from "./portfolio";
import { Stock } from "./stock/";
import { Transaction } from "./transaction";
import { Dividend } from "./dividend";

User.initModel(sequelize);
Portfolio.initModel(sequelize);
PortfolioStock.initModel(sequelize);
Stock.initModel(sequelize);
Transaction.initModel(sequelize);
Dividend.initModel(sequelize);

// User & Portfolio
User.hasOne(Portfolio, { foreignKey: "userId", as: "portfolio" });
Portfolio.belongsTo(User, { foreignKey: "userId", as: "user" });

// Portfolio & PortfolioStock
Portfolio.hasMany(PortfolioStock, {
  foreignKey: "portfolioId",
  as: "portfolioStocks",
});
PortfolioStock.belongsTo(Portfolio, {
  foreignKey: "portfolioId",
  as: "portfolio",
});

// Stock & PortfolioStock
Stock.hasMany(PortfolioStock, { foreignKey: "stockId", as: "portfolioStocks" });
PortfolioStock.belongsTo(Stock, { foreignKey: "stockId", as: "stock" });

// User & Transaction
User.hasMany(Transaction, { foreignKey: "userId", as: "transactions" });
Transaction.belongsTo(User, { foreignKey: "userId", as: "user" });

// Portfolio & Transaction
Portfolio.hasMany(Transaction, {
  foreignKey: "portfolioId",
  as: "transactions",
});
Transaction.belongsTo(Portfolio, {
  foreignKey: "portfolioId",
  as: "portfolio",
});

// Stock & Transaction
Stock.hasMany(Transaction, { foreignKey: "stockId", as: "transactions" });
Transaction.belongsTo(Stock, { foreignKey: "stockId", as: "stock" });

// Stock & Dividend
Stock.hasMany(Dividend, { foreignKey: "stockId", as: "dividends" });
Dividend.belongsTo(Stock, { foreignKey: "stockId", as: "stock" });

// User & Dividend
User.hasMany(Dividend, { foreignKey: "userId", as: "dividends" });
Dividend.belongsTo(User, { foreignKey: "userId", as: "user" });

// Portfolio & Dividend
Portfolio.hasMany(Dividend, { foreignKey: "portfolioId", as: "dividends" });
Dividend.belongsTo(Portfolio, { foreignKey: "portfolioId", as: "portfolio" });

export {
  User,
  Portfolio,
  PortfolioStock,
  Stock,
  Transaction,
  Dividend,
  sequelize,
};
