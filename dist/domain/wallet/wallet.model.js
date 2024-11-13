"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../sequelize");
const user_1 = require("../user");
const kuid_1 = __importDefault(require("kuid"));
class Wallet extends sequelize_1.Model {
}
exports.Wallet = Wallet;
Wallet.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: kuid_1.default,
        primaryKey: true,
    },
    availableBalance: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: user_1.User,
            key: "id",
        },
    },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: "wallets",
    timestamps: true,
    indexes: [
        {
            fields: ["userId"],
        },
    ],
});
user_1.User.hasMany(Wallet, { foreignKey: "userId" });
Wallet.belongsTo(user_1.User, { foreignKey: "userId" });
