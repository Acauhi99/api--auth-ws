"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portfolio = void 0;
const sequelize_1 = require("sequelize");
class Portfolio extends sequelize_1.Model {
    static initModel(sequelize) {
        Portfolio.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: () => `portfolio_${Date.now()}`,
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
                type: sequelize_1.DataTypes.FLOAT,
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
