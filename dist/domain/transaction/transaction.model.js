"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionType = void 0;
const sequelize_1 = require("sequelize");
const kuid_1 = __importDefault(require("kuid"));
var TransactionType;
(function (TransactionType) {
    TransactionType["BUY"] = "BUY";
    TransactionType["SELL"] = "SELL";
    TransactionType["DEPOSIT"] = "DEPOSIT";
    TransactionType["WITHDRAWAL"] = "WITHDRAWAL";
    TransactionType["DIVIDEND"] = "DIVIDEND";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
class Transaction extends sequelize_1.Model {
    static initModel(sequelize) {
        Transaction.init({
            id: {
                type: sequelize_1.DataTypes.STRING,
                defaultValue: () => (0, kuid_1.default)(),
                primaryKey: true,
            },
            type: {
                type: sequelize_1.DataTypes.ENUM(...Object.values(TransactionType)),
                allowNull: false,
                validate: {
                    isIn: {
                        args: [Object.values(TransactionType)],
                        msg: "Tipo de transação inválido.",
                    },
                },
            },
            amount: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
            quantity: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: true,
            },
            userId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                references: {
                    model: "users",
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
            stockId: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                references: {
                    model: "stocks",
                    key: "id",
                },
            },
        }, {
            sequelize,
            tableName: "transactions",
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
        return Transaction;
    }
}
exports.Transaction = Transaction;
