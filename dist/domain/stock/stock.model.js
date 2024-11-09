"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../sequelize");
const kuid_1 = __importDefault(require("kuid"));
class Stock extends sequelize_1.Model {
}
exports.Stock = Stock;
Stock.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: kuid_1.default,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    ticker: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    currentPrice: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: "stocks",
    timestamps: true,
});
