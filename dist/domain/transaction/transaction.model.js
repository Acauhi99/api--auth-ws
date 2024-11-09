"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.TransactionType = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../../sequelize");
const user_1 = require("../user");
const wallet_1 = require("../wallet");
const stock_1 = require("../stock");
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
}
exports.Transaction = Transaction;
Transaction.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: kuid_1.default,
        primaryKey: true,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: {
                args: [
                    [
                        TransactionType.BUY,
                        TransactionType.SELL,
                        TransactionType.DEPOSIT,
                        TransactionType.WITHDRAWAL,
                        TransactionType.DIVIDEND,
                    ],
                ],
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
            model: user_1.User,
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
    stockId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        references: {
            model: stock_1.Stock,
            key: "id",
        },
    },
}, {
    sequelize: sequelize_2.sequelize,
    tableName: "transactions",
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
user_1.User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(user_1.User, { foreignKey: "userId" });
wallet_1.Wallet.hasMany(Transaction, { foreignKey: "walletId" });
Transaction.belongsTo(wallet_1.Wallet, { foreignKey: "walletId" });
stock_1.Stock.hasMany(Transaction, { foreignKey: "stockId" });
Transaction.belongsTo(stock_1.Stock, { foreignKey: "stockId" });
