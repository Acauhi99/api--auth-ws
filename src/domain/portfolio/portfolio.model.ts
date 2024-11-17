import kuid from "kuid";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

export interface PortfolioAttributes {
  id: string;
  userId: string;
  balance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PortfolioCreationAttributes
  extends Optional<
    PortfolioAttributes,
    "id" | "balance" | "createdAt" | "updatedAt"
  > {}

export class Portfolio
  extends Model<PortfolioAttributes, PortfolioCreationAttributes>
  implements PortfolioAttributes
{
  public id!: string;
  public userId!: string;
  public balance!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Portfolio {
    Portfolio.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: () => kuid(),
          primaryKey: true,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
          unique: true,
        },
        balance: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        tableName: "portfolios",
        timestamps: true,
        indexes: [
          {
            fields: ["userId"],
            unique: true,
          },
        ],
      }
    );

    return Portfolio;
  }
}
