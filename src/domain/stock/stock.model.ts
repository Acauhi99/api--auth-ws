import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";
import kuid from "kuid";

export class Stock extends Model {
  public id!: string;
  public type!: string;
  public ticker!: string;
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
  },
  {
    sequelize,
    tableName: "stocks",
    timestamps: true,
  }
);

(async () => {
  await Stock.sync();
})();
