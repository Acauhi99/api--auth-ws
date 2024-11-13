import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../../sequelize";
import { User } from "../user";
import { Wallet } from "../wallet";
import { Stock } from "../stock";
import kuid from "kuid";

export interface DividendAttributes {
  id: string;
  stockId: string;
  walletId: string;
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
  public walletId!: string;
  public userId!: string;
  public amount!: number;
  public paymentDate!: Date;
  public declaredDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Dividend.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: kuid,
      primaryKey: true,
    },
    stockId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Stock,
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
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
        fields: ["walletId"],
      },
      {
        fields: ["stockId"],
      },
    ],
  }
);

User.hasMany(Dividend, { foreignKey: "userId" });
Dividend.belongsTo(User, { foreignKey: "userId" });

Wallet.hasMany(Dividend, { foreignKey: "walletId" });
Dividend.belongsTo(Wallet, { foreignKey: "walletId" });

Stock.hasMany(Dividend, { foreignKey: "stockId" });
Dividend.belongsTo(Stock, { foreignKey: "stockId" });
