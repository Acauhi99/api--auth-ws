"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dividend = void 0;
const sequelize_1 = require("sequelize");
const kuid_1 = __importDefault(require("kuid"));
class Dividend extends sequelize_1.Model {
    static initModel(sequelize) {
        Dividend.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: () => (0, kuid_1.default)(),
                primaryKey: true,
            },
            stockId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "stocks",
                    key: "id",
                },
            },
            portfolioId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "portfolios",
                    key: "id",
                },
            },
            userId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "users",
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
            sequelize,
            tableName: "dividends",
            timestamps: true,
            indexes: [
                {
                    fields: ["userId"],
                },
                {
                    fields: ["portfolioId"],
                },
                {
                    fields: ["stockId"],
                },
            ],
        });
        return Dividend;
    }
}
exports.Dividend = Dividend;
