import { sequelize } from "../sequelize";
import { User } from "./user";
import { Portfolio } from "./portfolio";
import { Stock } from "./stock";
import { Transaction } from "./transaction";

User.initModel(sequelize);
Portfolio.initModel(sequelize);
Stock.initModel(sequelize);
Transaction.initModel(sequelize);

// User & Portfolio
User.hasOne(Portfolio, { foreignKey: "userId", as: "portfolio" });
Portfolio.belongsTo(User, { foreignKey: "userId", as: "user" });

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
Stock.hasMany(Transaction, {
  foreignKey: "ticker",
  sourceKey: "ticker",
  as: "transactions",
});
Transaction.belongsTo(Stock, {
  foreignKey: "ticker",
  targetKey: "ticker",
  as: "stock",
});

export { User, Portfolio, Stock, Transaction, sequelize };
