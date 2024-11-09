import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { User } from "../user";
import { Wallet } from "../wallet";
import { Stock } from "../stock";
import kuid from "kuid";

export class Dividend extends Model {
  public id!: string;
  public stockId!: string;
  public walletId!: string;
  public userId!: string;
  public amount!: number;
  public paymentDate!: Date;
  public declaredDate!: Date;
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
