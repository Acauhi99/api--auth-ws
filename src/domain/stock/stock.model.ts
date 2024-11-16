import kuid from "kuid";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import { Transaction } from "../transaction";
import { Dividend } from "../dividend";

export enum StockType {
  STOCK = "STOCK",
  REIT = "REIT",
}

export interface StockRelations {
  transactions?: Transaction[];
  dividends?: Dividend[];
}

export interface StockAttributes {
  id: string;
  type: StockType;
  ticker: string;
  currentPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockCreationAttributes
  extends Optional<StockAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Stock
  extends Model<StockAttributes, StockCreationAttributes>
  implements StockAttributes
{
  declare id: string;
  declare type: StockType;
  declare ticker: string;
  declare currentPrice: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  static associate(models: any) {
    Stock.hasMany(models.Transaction, { foreignKey: "stockId" });
    Stock.hasMany(models.Dividend, { foreignKey: "stockId" });
  }

  static initModel(sequelize: Sequelize): typeof Stock {
    Stock.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: () => kuid(),
          primaryKey: true,
        },
        type: {
          type: DataTypes.ENUM(...Object.values(StockType)),
          allowNull: false,
        },
        ticker: {
          type: DataTypes.STRING(6),
          allowNull: false,
          unique: true,
          validate: {
            isUppercase: true,
            len: [4, 6],
          },
        },
        currentPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
          },
        },
      },
      {
        sequelize,
        tableName: "stocks",
        timestamps: true,
        indexes: [{ fields: ["ticker"], unique: true }, { fields: ["type"] }],
      }
    );

    return Stock;
  }
}
