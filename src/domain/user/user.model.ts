import kuid from "kuid";
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../sequelize";

export class User extends Model {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public birthDate!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      defaultValue: kuid,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
  }
);

(async () => {
  await User.sync();
})();
