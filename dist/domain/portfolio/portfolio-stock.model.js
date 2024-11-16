"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioStock = void 0;
const sequelize_1 = require("sequelize");
const kuid_1 = __importDefault(require("kuid"));
class PortfolioStock extends sequelize_1.Model {
    static initModel(sequelize) {
        PortfolioStock.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: () => (0, kuid_1.default)(),
                primaryKey: true,
            },
            portfolioId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "portfolios",
                    key: "id",
                },
            },
            stockId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "stocks",
                    key: "id",
                },
            },
            quantity: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
            averagePrice: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                },
            },
        }, {
            sequelize,
            tableName: "portfolio_stocks",
            timestamps: true,
            indexes: [
                {
                    fields: ["portfolioId"],
                },
                {
                    fields: ["stockId"],
                },
            ],
        });
        return PortfolioStock;
    }
}
exports.PortfolioStock = PortfolioStock;
