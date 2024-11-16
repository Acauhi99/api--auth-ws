import { DataTypes, Model, Optional, Sequelize } from "sequelize";
import kuid from "kuid";

export interface DividendAttributes {
  id: string;
  stockId: string;
  portfolioId: string;
  userId: string;
  amount: number;
  paymentDate: Date;
  declaredDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DividendCreationAttributes
  extends Optional<DividendAttributes, "id" | "createdAt" | "updatedAt"> {}

export class Dividend
  extends Model<DividendAttributes, DividendCreationAttributes>
  implements DividendAttributes
{
  public id!: string;
  public stockId!: string;
  public portfolioId!: string;
  public userId!: string;
  public amount!: number;
  public paymentDate!: Date;
  public declaredDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Dividend {
    Dividend.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: () => kuid(),
          primaryKey: true,
        },
        stockId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "stocks",
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
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        amount: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        paymentDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        declaredDate: {
          type: DataTypes.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "dividends",
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

    return Dividend;
  }
}
