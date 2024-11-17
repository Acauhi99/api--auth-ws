"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portfolio = void 0;
const kuid_1 = __importDefault(require("kuid"));
const sequelize_1 = require("sequelize");
class Portfolio extends sequelize_1.Model {
    static initModel(sequelize) {
        Portfolio.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: () => (0, kuid_1.default)(),
                primaryKey: true,
            },
            userId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
                unique: true,
            },
            balance: {
                type: sequelize_1.DataTypes.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            tableName: "portfolios",
            timestamps: true,
            indexes: [
                {
                    fields: ["userId"],
                    unique: true,
                },
            ],
        });
        return Portfolio;
    }
}
exports.Portfolio = Portfolio;
