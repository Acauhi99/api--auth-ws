"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dividend = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../sequelize");
const user_1 = require("../user");
const wallet_1 = require("../wallet");
const stock_1 = require("../stock");
const kuid_1 = __importDefault(require("kuid"));
class Dividend extends sequelize_1.Model {
}
exports.Dividend = Dividend;
Dividend.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: kuid_1.default,
        primaryKey: true,
    },
    stockId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: stock_1.Stock,
            key: "id",
        },
    },
    walletId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: wallet_1.Wallet,
            key: "id",
        },
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        references: {
            model: user_1.User,
            key: "id",
        },
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    paymentDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    declaredDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: sequelize_2.sequelize,
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
});
user_1.User.hasMany(Dividend, { foreignKey: "userId" });
Dividend.belongsTo(user_1.User, { foreignKey: "userId" });
wallet_1.Wallet.hasMany(Dividend, { foreignKey: "walletId" });
Dividend.belongsTo(wallet_1.Wallet, { foreignKey: "walletId" });
stock_1.Stock.hasMany(Dividend, { foreignKey: "stockId" });
Dividend.belongsTo(stock_1.Stock, { foreignKey: "stockId" });
