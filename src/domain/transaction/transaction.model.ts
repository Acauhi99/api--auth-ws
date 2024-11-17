import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import kuid from "kuid";
import { Stock } from "../stock";

export enum TransactionType {
  BUY = "BUY",
  SELL = "SELL",
  DEPOSIT = "DEPOSIT",
  WITHDRAWAL = "WITHDRAWAL",
  DIVIDEND = "DIVIDEND",
}

export interface TransactionAttributes {
  id: string;
  type: TransactionType;
  userId: string;
  portfolioId: string;
  ticker?: string;
  quantity?: number;
  price: number;
  amount: number;
  date: Date;
  createdAt?: Date;
  updatedAt?: Date;
  stock?: Stock;
}

export interface TransactionCreationAttributes
  extends Optional<
    TransactionAttributes,
    "id" | "quantity" | "ticker" | "createdAt" | "updatedAt"
  > {}

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public type!: TransactionType;
  public userId!: string;
  public portfolioId!: string;
  public ticker?: string;
  public quantity?: number;
  public price!: number;
  public amount!: number;
  public date!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public stock?: Stock;

  static initModel(sequelize: Sequelize): typeof Transaction {
    Transaction.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: () => kuid(),
          primaryKey: true,
        },
        type: {
          type: DataTypes.ENUM(...Object.values(TransactionType)),
          allowNull: false,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: { model: "users", key: "id" },
        },
        portfolioId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: { model: "portfolios", key: "id" },
        },
        ticker: {
          type: DataTypes.STRING(6),
          allowNull: true,
          references: { model: "stocks", key: "ticker" },
        },
        quantity: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        amount: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "transactions",
        timestamps: true,
        indexes: [
          { fields: ["userId"] },
          { fields: ["portfolioId"] },
          { fields: ["ticker"] },
          { fields: ["type"] },
          { fields: ["date"] },
        ],
      }
    );

    return Transaction;
  }
}
