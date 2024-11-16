import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import kuid from "kuid";
import { Stock } from "../stock";

export interface PortfolioStockAttributes {
  id: string;
  portfolioId: string;
  stockId: string;
  quantity: number;
  averagePrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  stock?: Stock;
}

export interface PortfolioStockCreationAttributes
  extends Optional<
    PortfolioStockAttributes,
    "id" | "createdAt" | "updatedAt"
  > {}

export class PortfolioStock
  extends Model<PortfolioStockAttributes, PortfolioStockCreationAttributes>
  implements PortfolioStockAttributes
{
  public id!: string;
  public portfolioId!: string;
  public stockId!: string;
  public quantity!: number;
  public averagePrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public stock?: Stock;

  static initModel(sequelize: Sequelize): typeof PortfolioStock {
    PortfolioStock.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: () => kuid(),
          primaryKey: true,
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
          allowNull: false,
          references: {
            model: "stocks",
            key: "id",
          },
        },
        quantity: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
          validate: {
            min: 0,
          },
        },
        averagePrice: {
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
        tableName: "portfolio_stocks",
        timestamps: true,
        indexes: [
          {
            fields: ["portfolioId"],
          },
          {
            fields: ["stockId"],
          },
        ],
      }
    );

    return PortfolioStock;
  }
}
