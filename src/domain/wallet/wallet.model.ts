import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { User } from "../user";
import kuid from "kuid";

export class Wallet extends Model {
  public id!: string;
  public availableBalance!: number;
  public userId!: string;
}

Wallet.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: kuid,
      primaryKey: true,
    },
    availableBalance: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "wallets",
    timestamps: true,
    indexes: [
      {
        fields: ["userId"],
      },
    ],
  }
);

User.hasMany(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(User, { foreignKey: "userId" });
