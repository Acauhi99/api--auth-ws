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
  amount: number;
  quantity?: number;
  userId: string;
  portfolioId: string;
  stockId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TransactionWithStock extends Transaction {
  stock?: Stock;
}

export interface TransactionCreationAttributes
  extends Optional<
    TransactionAttributes,
    "id" | "quantity" | "stockId" | "createdAt" | "updatedAt"
  > {}

export class Transaction
  extends Model<TransactionAttributes, TransactionCreationAttributes>
  implements TransactionAttributes
{
  public id!: string;
  public type!: TransactionType;
  public amount!: number;
  public quantity?: number;
  public userId!: string;
  public portfolioId!: string;
  public stockId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

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
          validate: {
            isIn: {
              args: [Object.values(TransactionType)],
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
            model: "users",
            key: "id",
          },
        },
        portfolioId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "portfolios",
            key: "id",
          },
        },
        stockId: {
          type: DataTypes.STRING,
          allowNull: true,
          references: {
            model: "stocks",
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
            fields: ["portfolioId"],
          },
          {
            fields: ["stockId"],
          },
        ],
      }
    );

    return Transaction;
  }
}
