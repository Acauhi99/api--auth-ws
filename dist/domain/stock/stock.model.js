"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stock = exports.StockType = void 0;
const kuid_1 = __importDefault(require("kuid"));
const sequelize_1 = require("sequelize");
var StockType;
(function (StockType) {
    StockType["STOCK"] = "STOCK";
    StockType["REIT"] = "REIT";
})(StockType || (exports.StockType = StockType = {}));
class Stock extends sequelize_1.Model {
    static associate(models) {
        Stock.hasMany(models.Transaction, { foreignKey: "stockId" });
    }
    static initModel(sequelize) {
        Stock.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: () => (0, kuid_1.default)(),
                primaryKey: true,
            },
            type: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(StockType)),
                allowNull: false,
            },
            ticker: {
                type: sequelize_1.DataTypes.STRING(6),
                allowNull: false,
                unique: true,
                validate: {
                    isUppercase: true,
                    len: [4, 6],
                },
            },
            currentPrice: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
        }, {
            sequelize,
            tableName: "stocks",
            timestamps: true,
            indexes: [{ fields: ["ticker"], unique: true }, { fields: ["type"] }],
        });
        return Stock;
    }
}
exports.Stock = Stock;
