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
const transaction_repository_1 = require("../transaction/transaction.repository");
const transaction_1 = require("../transaction");
const sequelize_1 = require("../../sequelize");
const stock_1 = require("../stock");
class PortfolioService {
    constructor() {
        this.portfolioRepository = new portfolio_repository_1.PortfolioRepository();
        this.transactionRepository = new transaction_repository_1.TransactionRepository();
        this.stockService = new stock_1.StockService();
    }
    createPortfolio(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPortfolio = yield this.portfolioRepository.findByUserId(userId);
            if (existingPortfolio) {
                throw new Error("Portfólio já existe para este usuário");
            }
            const t = yield sequelize_1.sequelize.transaction();
            try {
                const portfolio = yield this.portfolioRepository.create(userId, t);
                yield t.commit();
                return portfolio;
            }
            catch (error) {
                yield t.rollback();
                throw error;
            }
        });
    }
    getPortfolioDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield this.portfolioRepository.findByUserId(userId);
            if (!portfolio) {
                throw new Error("Portfólio não encontrado");
            }
            return portfolio;
        });
    }
    getPositions(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield this.portfolioRepository.findByUserId(userId);
            if (!portfolio) {
                throw new Error("Portfólio não encontrado");
            }
            const transactions = yield this.transactionRepository.findByPortfolioIdAndType(portfolio.id, [
                transaction_1.TransactionType.BUY,
                transaction_1.TransactionType.SELL,
            ]);
            const positionsMap = this.calculatePositions(transactions);
            const validPositions = this.filterValidPositions(positionsMap);
            if (validPositions.length === 0) {
                return [];
            }
            const prices = yield this.getCurrentPrices(validPositions.map((pos) => pos.ticker));
            return this.combinePositionsWithPrices(validPositions, prices);
        });
    }
    getPerformance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield this.portfolioRepository.findByUserId(userId);
            if (!portfolio) {
                throw new Error("Portfólio não encontrado");
            }
            const oneMonthAgo = this.getDateOneMonthAgo();
            const transactions = yield this.transactionRepository.findByPortfolioIdAfterDate(portfolio.id, oneMonthAgo, [transaction_1.TransactionType.BUY, transaction_1.TransactionType.SELL, transaction_1.TransactionType.DIVIDEND]);
            const { totalInvested, totalGains, totalDividends } = this.calculateFinancials(transactions);
            const currentPositions = yield this.getPositions(userId);
            const currentTotalValue = this.calculateCurrentTotalValue(currentPositions);
            const appreciation = currentTotalValue - totalInvested;
            const profitability = this.calculateProfitability(totalGains, totalDividends, appreciation, totalInvested);
            return {
                totalInvested: this.formatNumber(totalInvested, 2),
                totalGains: this.formatNumber(totalGains, 2),
                totalDividends: this.formatNumber(totalDividends, 2),
                currentTotalValue: this.formatNumber(currentTotalValue, 2),
                appreciation: this.formatNumber(appreciation, 2),
                profitability: `${this.formatNumber(profitability, 2)}%`,
            };
        });
    }
    getCurrentPrices(tickers) {
        return __awaiter(this, void 0, void 0, function* () {
            const prices = yield Promise.all(tickers.map((ticker) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const stockInfo = yield this.stockService.getStockInfo(ticker);
                    return {
                        symbol: stockInfo.symbol,
                        currentPrice: stockInfo.currentPrice,
                    };
                }
                catch (error) {
                    console.error(`Erro ao obter preço para ${ticker}:`, error);
                    return {
                        symbol: ticker,
                        currentPrice: null,
                    };
                }
            })));
            return prices;
        });
    }
    calculatePositions(transactions) {
        const positionsMap = {};
        transactions.forEach((tx) => {
            if (tx.ticker && tx.quantity) {
                positionsMap[tx.ticker] =
                    (positionsMap[tx.ticker] || 0) +
                        (tx.type === transaction_1.TransactionType.BUY ? tx.quantity : -tx.quantity);
            }
        });
        return positionsMap;
    }
    filterValidPositions(positionsMap) {
        return Object.entries(positionsMap)
            .filter(([_, quantity]) => quantity > 0)
            .map(([ticker, quantity]) => ({ ticker, quantity }));
    }
    combinePositionsWithPrices(validPositions, prices) {
        return validPositions.map((pos) => {
            const priceInfo = prices.find((p) => p.symbol === pos.ticker);
            return {
                ticker: pos.ticker,
                quantity: pos.quantity,
                currentPrice: priceInfo ? priceInfo.currentPrice : null,
                totalValue: priceInfo && priceInfo.currentPrice !== null
                    ? parseFloat((pos.quantity * priceInfo.currentPrice).toFixed(1))
                    : null,
            };
        });
    }
    getDateOneMonthAgo() {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date;
    }
    calculateFinancials(transactions) {
        let totalInvested = 0;
        let totalGains = 0;
        let totalDividends = 0;
        transactions.forEach((tx) => {
            switch (tx.type) {
                case transaction_1.TransactionType.BUY:
                    totalInvested += Number(tx.amount);
                    break;
                case transaction_1.TransactionType.SELL:
                    totalGains += Number(tx.amount);
                    break;
                case transaction_1.TransactionType.DIVIDEND:
                    totalDividends += Number(tx.amount);
                    break;
                default:
                    break;
            }
        });
        return { totalInvested, totalGains, totalDividends };
    }
    calculateCurrentTotalValue(currentPositions) {
        return currentPositions.reduce((acc, pos) => acc + (pos.totalValue || 0), 0);
    }
    calculateProfitability(totalGains, totalDividends, appreciation, totalInvested) {
        return ((totalGains + totalDividends + appreciation) / totalInvested) * 100;
    }
    formatNumber(value, decimals) {
        return value.toFixed(decimals);
    }
}
exports.PortfolioService = PortfolioService;
