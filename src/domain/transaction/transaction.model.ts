import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import { User } from "../user/user.model";
import { Wallet } from "../wallet/wallet.model";
import { Stock } from "../stock/stock.model";
import kuid from "kuid";

export class Transaction extends Model {
  public id!: string;
  public type!: string;
  public amount!: number;
  public quantity!: number | null;
  public stockId!: string | null;
  public walletId!: string;
  public userId!: string;
  public transactionDate!: Date;
}

Transaction.init(
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
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    stockId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Stock,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    walletId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Wallet,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
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
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "transactions",
    timestamps: true,
  }
);

User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

Wallet.hasMany(Transaction, { foreignKey: "walletId" });
Transaction.belongsTo(Wallet, { foreignKey: "walletId" });

Stock.hasMany(Transaction, { foreignKey: "stockId" });
Transaction.belongsTo(Stock, { foreignKey: "stockId" });

(async () => {
  await Transaction.sync();
})();
