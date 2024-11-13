import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../sequelize";
import kuid from "kuid";

export interface StockAttributes {
  id: string;
  type: string;
  ticker: string;
  currentPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface StockCreationAttributes
  extends Optional<StockAttributes, "id" | "currentPrice"> {}

export class Stock
  extends Model<StockAttributes, StockCreationAttributes>
  implements StockAttributes
{
  public id!: string;
  public type!: string;
  public ticker!: string;
  public currentPrice!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Stock.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: kuid,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ticker: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    currentPrice: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "stocks",
    timestamps: true,
  }
);
