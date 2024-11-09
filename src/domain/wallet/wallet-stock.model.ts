import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { Wallet } from "./wallet.model";
import { Stock } from "../stock";
import kuid from "kuid";

export class WalletStock extends Model {
  public id!: string;
  public walletId!: string;
  public stockId!: string;
  public quantity!: number;
  public averagePurchasePrice!: number;
  public monthlyProfitability!: number | null;
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
    },
    stockId: {
      type: DataTypes.STRING,
      references: {
        model: Stock,
        key: "id",
      },
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    averagePurchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    monthlyProfitability: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "wallet_stocks",
    timestamps: true,
    indexes: [
      {
        fields: ["walletId"],
      },
      {
        fields: ["stockId"],
      },
    ],
  }
);

Wallet.hasMany(WalletStock, { foreignKey: "walletId" });
WalletStock.belongsTo(Wallet, { foreignKey: "walletId" });

Stock.hasMany(WalletStock, { foreignKey: "stockId" });
WalletStock.belongsTo(Stock, { foreignKey: "stockId" });
