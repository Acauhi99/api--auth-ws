import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { User } from "../user";
import { Wallet } from "../wallet";
import { Stock } from "../stock";
import kuid from "kuid";

export enum TransactionType {
  BUY = "BUY",
  SELL = "SELL",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  DIVIDEND = "DIVIDEND",
}

export class Transaction extends Model {
  public id!: string;
  public type!: String;
  public amount!: number;
  public quantity!: number;
  public userId!: string;
  public walletId!: string;
  public stockId!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: kuid,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [
            [
              TransactionType.BUY,
              TransactionType.SELL,
              TransactionType.DEPOSIT,
              TransactionType.WITHDRAWAL,
              TransactionType.DIVIDEND,
            ],
          ],
          msg: "Tipo de transação inválido.",
        },
      },
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    walletId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Wallet,
        key: "id",
      },
    },
    stockId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Stock,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
      {
        fields: ["walletId"],
      },
      {
        fields: ["stockId"],
      },
    ],
  }
);

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

Wallet.hasMany(Transaction, { foreignKey: "walletId" });
Transaction.belongsTo(Wallet, { foreignKey: "walletId" });

Stock.hasMany(Transaction, { foreignKey: "stockId" });
Transaction.belongsTo(Stock, { foreignKey: "stockId" });
