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
exports.PortfolioService = void 0;
const portfolio_repository_1 = require("./portfolio.repository");
const portfolio_stock_repository_1 = require("./portfolio-stock.repository");
const transaction_1 = require("../transaction");
const stock_1 = require("../stock");
const transaction_2 = require("../transaction");
const sequelize_1 = require("../../sequelize");
class PortfolioService {
    constructor() {
        this.portfolioRepository = new portfolio_repository_1.PortfolioRepository();
        this.portfolioStockRepository = new portfolio_stock_repository_1.PortfolioStockRepository();
        this.transactionRepository = new transaction_1.TransactionRepository();
        this.stockRepository = new stock_1.StockRepository();
    }
    getPortfolioByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.portfolioRepository.findByUserId(userId);
        });
    }
    deposit(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (amount <= 0)
                throw new Error("O valor do depósito deve ser positivo.");
            return yield sequelize_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const portfolio = yield this.portfolioRepository.findByUserId(userId, t);
                if (!portfolio)
                    throw new Error("Carteira não encontrada");
                portfolio.balance += amount;
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance, t);
                const transactionData = {
                    type: transaction_2.TransactionType.DEPOSIT,
                    amount,
                    userId,
                    portfolioId: portfolio.id,
                };
                yield this.transactionRepository.create(transactionData, t);
                return portfolio;
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
                    throw new Error("Carteira não encontrada");
                if (portfolio.balance < amount) {
                    throw new Error("Saldo insuficiente para a retirada.");
                }
                portfolio.balance -= amount;
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance, t);
                const transactionData = {
                    type: transaction_2.TransactionType.WITHDRAWAL,
                    amount,
                    userId,
                    portfolioId: portfolio.id,
                };
                yield this.transactionRepository.create(transactionData, t);
                return portfolio;
            }));
        });
    }
    buyStock(userId, stockId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sequelize_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const portfolio = yield this.portfolioRepository.findByUserId(userId, t);
                if (!portfolio)
                    throw new Error("Carteira não encontrada");
                const stock = yield this.stockRepository.findById(stockId);
                if (!stock)
                    throw new Error("Ação não encontrada");
                const currentPrice = stock.currentPrice;
                if (currentPrice === null)
                    throw new Error("Não foi possível obter o preço da ação");
                const totalCost = quantity * currentPrice;
                if (portfolio.balance < totalCost) {
                    throw new Error("Saldo insuficiente para a compra");
                }
                portfolio.balance -= totalCost;
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance, t);
                yield this.portfolioStockRepository.addOrUpdateStock(portfolio.id, stockId, quantity, currentPrice, t);
                const transactionData = {
                    type: transaction_2.TransactionType.BUY,
                    amount: totalCost,
                    quantity,
                    userId,
                    portfolioId: portfolio.id,
                    stockId,
                    priceAtTransaction: currentPrice,
                };
                yield this.transactionRepository.create(transactionData, t);
                return { message: "Ação comprada com sucesso" };
            }));
        });
    }
    sellStock(userId, stockId, quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield sequelize_1.sequelize.transaction((t) => __awaiter(this, void 0, void 0, function* () {
                const portfolio = yield this.portfolioRepository.findByUserId(userId, t);
                if (!portfolio)
                    throw new Error("Carteira não encontrada");
                const portfolioStock = yield this.portfolioStockRepository.findStockInPortfolio(portfolio.id, stockId);
                if (!portfolioStock)
                    throw new Error("Ação não encontrada na carteira");
                if (portfolioStock.quantity < quantity) {
                    throw new Error("Quantidade insuficiente de ações para venda");
                }
                const stock = yield this.stockRepository.findById(stockId);
                if (!stock)
                    throw new Error("Ação não encontrada");
                const currentPrice = stock.currentPrice;
                if (currentPrice === null)
                    throw new Error("Não foi possível obter o preço da ação");
                const totalRevenue = quantity * currentPrice;
                portfolio.balance += totalRevenue;
                yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance, t);
                yield this.portfolioStockRepository.removeStock(portfolio.id, stockId, quantity, t);
                const transactionData = {
                    type: transaction_2.TransactionType.SELL,
                    amount: totalRevenue,
                    quantity,
                    userId,
                    portfolioId: portfolio.id,
                    stockId,
                    priceAtTransaction: currentPrice,
                };
                yield this.transactionRepository.create(transactionData, t);
                return { message: "Ação vendida com sucesso" };
            }));
        });
    }
    getSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield this.portfolioRepository.findByUserId(userId);
            if (!portfolio)
                throw new Error("Carteira não encontrada");
            let totalInvestment = 0;
            let currentValue = 0;
            for (const portfolioStock of portfolio.portfolioStocks || []) {
                totalInvestment += portfolioStock.averagePrice * portfolioStock.quantity;
                const stock = yield this.stockRepository.findById(portfolioStock.stockId);
                if (stock && stock.currentPrice !== null) {
                    currentValue += stock.currentPrice * portfolioStock.quantity;
                }
            }
            const profitLoss = currentValue - totalInvestment;
            return {
                totalInvestment,
                currentValue,
                profitLoss,
                balance: portfolio.balance,
            };
        });
    }
    getPerformance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            const transactions = yield this.transactionRepository.findByUserId(userId, filter);
            let investment = 0;
            let returns = 0;
            for (const transaction of transactions) {
                switch (transaction.type) {
                    case transaction_2.TransactionType.BUY:
                        investment += transaction.amount;
                        break;
                    case transaction_2.TransactionType.SELL:
                    case transaction_2.TransactionType.DIVIDEND:
                        returns += transaction.amount;
                        break;
                    default:
                        break;
                }
            }
            const profitability = investment === 0 ? 0 : ((returns - investment) / investment) * 100;
            return {
                investment,
                returns,
                profitability,
            };
        });
    }
}
exports.PortfolioService = PortfolioService;
