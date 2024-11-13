"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepository = void 0;
const sequelize_1 = require("sequelize");
const transaction_model_1 = require("./transaction.model");
const stock_1 = require("../stock");
class TransactionRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield transaction_model_1.Transaction.create(data);
            }
            catch (error) {
                throw new Error(`Erro ao criar transação: dados inválidos ou incompletos`);
            }
        });
    }
    findByUserId(userId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const where = { userId };
                if ((_a = filter.type) === null || _a === void 0 ? void 0 : _a.length) {
                    where.type = { [sequelize_1.Op.in]: filter.type };
                }
                if (filter.startDate && filter.endDate) {
                    where.createdAt = {
                        [sequelize_1.Op.between]: [filter.startDate, filter.endDate],
                    };
                }
                if (filter.stockId) {
                    where.stockId = filter.stockId;
                }
                const transactions = yield transaction_model_1.Transaction.findAll({
                    where,
                    include: [
                        {
                            model: stock_1.Stock,
                            attributes: ["ticker"],
                        },
                    ],
                    order: [["createdAt", "DESC"]],
                });
                return transactions;
            }
            catch (error) {
                throw new Error(`Erro ao buscar transações do usuário ${userId}`);
            }
        });
    }
    findWalletTransactions(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield transaction_model_1.Transaction.findAll({
                    where: { walletId },
                    order: [["createdAt", "ASC"]],
                });
            }
            catch (error) {
                throw new Error(`Erro ao buscar transações da carteira ${walletId}`);
            }
        });
    }
    getStockTransactionBalance(walletId, stockId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield transaction_model_1.Transaction.findAll({
                    where: {
                        walletId,
                        stockId,
                        type: {
                            [sequelize_1.Op.in]: [transaction_model_1.TransactionType.BUY, transaction_model_1.TransactionType.SELL],
                        },
                    },
                });
                return transactions.reduce((balance, tx) => {
                    return (balance +
                        (tx.type === transaction_model_1.TransactionType.BUY ? tx.quantity : -tx.quantity));
                }, 0);
            }
            catch (error) {
                throw new Error(`Erro ao calcular saldo de ações na carteira ${walletId} para o ativo ${stockId}`);
            }
        });
    }
    getWalletBalance(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transactions = yield transaction_model_1.Transaction.findAll({
                    where: { walletId },
                });
                return transactions.reduce((balance, tx) => {
                    switch (tx.type) {
                        case transaction_model_1.TransactionType.DEPOSIT:
                        case transaction_model_1.TransactionType.SELL:
                        case transaction_model_1.TransactionType.DIVIDEND:
                            return balance + tx.amount;
                        case transaction_model_1.TransactionType.WITHDRAWAL:
                        case transaction_model_1.TransactionType.BUY:
                            return balance - tx.amount;
                        default:
                            return balance;
                    }
                }, 0);
            }
            catch (error) {
                throw new Error(`Erro ao calcular saldo total da carteira ${walletId}`);
            }
        });
    }
}
exports.TransactionRepository = TransactionRepository;
