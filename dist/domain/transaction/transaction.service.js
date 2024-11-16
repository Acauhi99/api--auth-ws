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
const sequelize_1 = require("../../sequelize");
const transaction_repository_1 = require("./transaction.repository");
const portfolio_1 = require("../portfolio");
const portfolio_2 = require("../portfolio");
const stock_1 = require("../stock");
const transaction_model_1 = require("./transaction.model");
class TransactionService {
    constructor() {
        this.transactionRepository = new transaction_repository_1.TransactionRepository();
        this.portfolioRepository = new portfolio_1.PortfolioRepository();
        this.portfolioStockRepository = new portfolio_2.PortfolioStockRepository();
        this.stockRepository = new stock_1.StockRepository();
    }
    createTransaction(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.transactionRepository.create(Object.assign(Object.assign({}, data), { userId }));
            return transaction;
        });
    }
    getTransactionsByUserId(userId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionRepository.findByUserId(userId, filter);
        });
    }
    getDetailedHistory(userId, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.getTransactionsByUserId(userId, filter);
            let balance = 0;
            return transactions.map((tx) => {
                var _a;
                balance += this.calculateBalanceImpact(tx);
                return {
                    date: tx.createdAt,
                    type: tx.type,
                    stockTicker: (_a = tx.stock) === null || _a === void 0 ? void 0 : _a.ticker,
                    quantity: tx.quantity,
                    price: tx.quantity ? tx.amount / tx.quantity : 0,
                    total: tx.amount,
                    balance,
                };
            });
        });
    }
    buyStock(userId, stockId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0)
                throw new Error("A quantidade deve ser maior que zero.");
            return yield sequelize_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const portfolio = yield this.portfolioRepository.findByUserId(userId, t);
                if (!portfolio)
                    throw new Error("Carteira não encontrada.");
                const stock = yield this.stockRepository.findById(stockId);
                if (!stock)
                    throw new Error("Ação não encontrada.");
                const currentPrice = stock.currentPrice;
                if (currentPrice === null || currentPrice === undefined)
                    throw new Error("Preço atual da ação não disponível.");
                const totalAmount = currentPrice * quantity;
                if (portfolio.balance < totalAmount)
                    throw new Error("Saldo insuficiente para a compra.");
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance - totalAmount, t);
                yield this.portfolioStockRepository.addOrUpdateStock(portfolio.id, stockId, quantity, currentPrice, t);
                const transaction = yield this.transactionRepository.create({
                    type: transaction_model_1.TransactionType.BUY,
                    amount: totalAmount,
                    quantity,
                    userId,
                    portfolioId: portfolio.id,
                    stockId,
                }, t);
                return transaction;
            }));
        });
    }
    sellStock(userId, stockId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (quantity <= 0)
                throw new Error("A quantidade deve ser maior que zero.");
            return yield sequelize_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const portfolio = yield this.portfolioRepository.findByUserId(userId, t);
                if (!portfolio)
                    throw new Error("Carteira não encontrada.");
                const portfolioStock = yield this.portfolioStockRepository.findStockInPortfolio(portfolio.id, stockId, t);
                if (!portfolioStock || portfolioStock.quantity < quantity) {
                    throw new Error("Quantidade insuficiente de ações para venda.");
                }
                const stock = yield this.stockRepository.findById(stockId);
                if (!stock)
                    throw new Error("Ação não encontrada.");
                const currentPrice = stock.currentPrice;
                if (currentPrice === null || currentPrice === undefined)
                    throw new Error("Preço atual da ação não disponível.");
                const totalAmount = currentPrice * quantity;
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance + totalAmount, t);
                yield this.portfolioStockRepository.removeStock(portfolio.id, stockId, quantity, t);
                const transaction = yield this.transactionRepository.create({
                    type: transaction_model_1.TransactionType.SELL,
                    amount: totalAmount,
                    quantity,
                    userId,
                    portfolioId: portfolio.id,
                    stockId,
                }, t);
                return transaction;
            }));
        });
    }
    deposit(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0)
                throw new Error("O valor do depósito deve ser positivo.");
            return yield sequelize_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const portfolio = yield this.portfolioRepository.findByUserId(userId, t);
                if (!portfolio)
                    throw new Error("Carteira não encontrada.");
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance + amount, t);
                const transaction = yield this.transactionRepository.create({
                    type: transaction_model_1.TransactionType.DEPOSIT,
                    amount,
                    userId,
                    portfolioId: portfolio.id,
                }, t);
                return transaction;
            }));
        });
    }
    withdraw(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0)
                throw new Error("O valor da retirada deve ser positivo.");
            return yield sequelize_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const portfolio = yield this.portfolioRepository.findByUserId(userId, t);
                if (!portfolio)
                    throw new Error("Carteira não encontrada.");
                if (portfolio.balance < amount)
                    throw new Error("Saldo insuficiente para a retirada.");
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance - amount, t);
                const transaction = yield this.transactionRepository.create({
                    type: transaction_model_1.TransactionType.WITHDRAWAL,
                    amount,
                    userId,
                    portfolioId: portfolio.id,
                }, t);
                return transaction;
            }));
        });
    }
    calculateBalanceImpact(transaction) {
        switch (transaction.type) {
            case transaction_model_1.TransactionType.DEPOSIT:
            case transaction_model_1.TransactionType.SELL:
            case transaction_model_1.TransactionType.DIVIDEND:
                return transaction.amount;
            case transaction_model_1.TransactionType.WITHDRAWAL:
            case transaction_model_1.TransactionType.BUY:
                return -transaction.amount;
            default:
                return 0;
        }
    }
}
exports.TransactionService = TransactionService;
