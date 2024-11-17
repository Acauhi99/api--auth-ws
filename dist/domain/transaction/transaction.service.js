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
exports.TransactionService = void 0;
const transaction_model_1 = require("./transaction.model");
const transaction_repository_1 = require("./transaction.repository");
const portfolio_repository_1 = require("../portfolio/portfolio.repository");
const sequelize_1 = require("../../sequelize");
class TransactionService {
    constructor() {
        this.transactionRepository = new transaction_repository_1.TransactionRepository();
        this.portfolioRepository = new portfolio_repository_1.PortfolioRepository();
    }
    createTransaction(userId, transactionData) {
        return __awaiter(this, void 0, void 0, function* () {
            const t = yield sequelize_1.sequelize.transaction();
            try {
                const portfolio = yield this.portfolioRepository.findById(transactionData.portfolioId, t);
                if (!portfolio) {
                    throw new Error("Portfólio não encontrado");
                }
                if (portfolio.userId !== userId) {
                    throw new Error("O portfólio não pertence ao usuário");
                }
                // Mapeamento de handlers por tipo de transação
                const handlers = {
                    [transaction_model_1.TransactionType.BUY]: () => __awaiter(this, void 0, void 0, function* () {
                        yield this.validateBuyTransaction(portfolio.balance, transactionData.amount);
                        yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance - transactionData.amount, t);
                    }),
                    [transaction_model_1.TransactionType.SELL]: () => __awaiter(this, void 0, void 0, function* () {
                        const currentPosition = yield this.transactionRepository.getCurrentPosition(userId, transactionData.ticker, t);
                        if (currentPosition < transactionData.quantity) {
                            throw new Error("Quantidade insuficiente de ações");
                        }
                        yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance + transactionData.amount, t);
                    }),
                    [transaction_model_1.TransactionType.DEPOSIT]: () => __awaiter(this, void 0, void 0, function* () {
                        yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance + transactionData.amount, t);
                    }),
                    [transaction_model_1.TransactionType.WITHDRAWAL]: () => __awaiter(this, void 0, void 0, function* () {
                        yield this.validateWithdrawal(portfolio.balance, transactionData.amount);
                        yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance - transactionData.amount, t);
                    }),
                    [transaction_model_1.TransactionType.DIVIDEND]: () => __awaiter(this, void 0, void 0, function* () {
                        yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance + transactionData.amount, t);
                    }),
                };
                const handler = handlers[transactionData.type];
                if (!handler) {
                    throw new Error("Tipo de transação inválido");
                }
                yield handler();
                const transaction = yield this.transactionRepository.create(Object.assign(Object.assign({}, transactionData), { userId, date: new Date() }), t);
                yield t.commit();
                return transaction;
            }
            catch (error) {
                yield t.rollback();
                throw error;
            }
        });
    }
    getTransactionHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionRepository.findByUserId(userId);
        });
    }
    validateBuyTransaction(balance, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (balance < amount)
                throw new Error("Saldo insuficiente");
        });
    }
    validateWithdrawal(balance, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (balance < amount)
                throw new Error("Saldo insuficiente");
        });
    }
}
exports.TransactionService = TransactionService;
