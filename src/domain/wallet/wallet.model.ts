import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { User } from "../user/user.model";
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
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  },
  {
    sequelize,
    tableName: "wallets",
    timestamps: true,
  }
);

User.hasOne(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(User, { foreignKey: "userId" });

(async () => {
  await Wallet.sync();
})();
