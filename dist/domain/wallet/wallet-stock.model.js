"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletStock = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../sequelize");
const wallet_model_1 = require("./wallet.model");
const stock_1 = require("../stock");
const kuid_1 = __importDefault(require("kuid"));
class WalletStock extends sequelize_1.Model {
}
exports.WalletStock = WalletStock;
WalletStock.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: kuid_1.default,
        primaryKey: true,
    },
    walletId: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: wallet_model_1.Wallet,
            key: "id",
        },
    },
    stockId: {
        type: sequelize_1.DataTypes.STRING,
        references: {
            model: stock_1.Stock,
            key: "id",
        },
    },
    quantity: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    averagePurchasePrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
    },
    monthlyProfitability: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: "wallet_stocks",
    timestamps: true,
    indexes: [
        {
            fields: ["walletId"],
        },
        {
            fields: ["stockId"],
        },
    ],
});
wallet_model_1.Wallet.hasMany(WalletStock, { foreignKey: "walletId" });
WalletStock.belongsTo(wallet_model_1.Wallet, { foreignKey: "walletId" });
stock_1.Stock.hasMany(WalletStock, { foreignKey: "stockId" });
WalletStock.belongsTo(stock_1.Stock, { foreignKey: "stockId" });
