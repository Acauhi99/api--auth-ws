import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { Wallet } from "./wallet.model";
import { Stock } from "../stock/stock.model";
import kuid from "kuid";

export class WalletStock extends Model {
  public id!: string;
  public walletId!: string;
  public stockId!: string;
  public quantity!: number;
  public averagePurchasePrice!: number;
}

WalletStock.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: kuid,
      primaryKey: true,
    },
    walletId: {
      type: DataTypes.STRING,
      references: {
        model: Wallet,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    stockId: {
      type: DataTypes.STRING,
      references: {
        model: Stock,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    averagePurchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "wallet_stocks",
    timestamps: true,
  }
);

Wallet.hasMany(WalletStock, { foreignKey: "walletId" });
WalletStock.belongsTo(Wallet, { foreignKey: "walletId" });

Stock.hasMany(WalletStock, { foreignKey: "stockId" });
WalletStock.belongsTo(Stock, { foreignKey: "stockId" });

(async () => {
  await WalletStock.sync();
})();
