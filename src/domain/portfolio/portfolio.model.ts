import {
  DataTypes,
  Model,
  Optional,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  Sequelize,
} from "sequelize";
import { PortfolioStock } from "./portfolio-stock.model";

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
  public readonly portfolioStocks?: PortfolioStock[];

  public getPortfolioStocks!: HasManyGetAssociationsMixin<PortfolioStock>;
  public addPortfolioStock!: HasManyAddAssociationMixin<PortfolioStock, string>;

  static initModel(sequelize: Sequelize): typeof Portfolio {
    Portfolio.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: () => `portfolio_${Date.now()}`,
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
          type: DataTypes.FLOAT,
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
