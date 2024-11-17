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
class PortfolioService {
    constructor() {
        this.portfolioRepository = new portfolio_repository_1.PortfolioRepository();
        this.transactionRepository = new transaction_repository_1.TransactionRepository();
    }
    createPortfolio(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingPortfolio = yield this.portfolioRepository.findByUserId(userId);
            if (existingPortfolio) {
                throw new Error("Portfolio already exists");
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
    getOverview(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield this.portfolioRepository.findByUserId(userId);
            if (!portfolio)
                throw new Error("Portfolio not found");
            const transactions = yield this.transactionRepository.findByUserId(userId);
            const totalInvested = transactions
                .filter((t) => t.type === transaction_1.TransactionType.BUY)
                .reduce((sum, t) => sum + t.amount, 0);
            const totalDividends = transactions
                .filter((t) => t.type === transaction_1.TransactionType.DIVIDEND)
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                balance: portfolio.balance,
                totalInvested,
                totalValue: totalInvested, // Will need to calculate with current prices
                totalDividends,
            };
        });
    }
    getMonthlyPerformance(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield this.transactionRepository.findByUserId(userId);
            // Group by month and calculate performance
            // This is a simplified version
            return [];
        });
    }
    getDividendsHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionRepository.findByUserIdAndType(userId, transaction_1.TransactionType.DIVIDEND);
        });
    }
    getPortfolioHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.transactionRepository.findByUserId(userId);
        });
    }
}
exports.PortfolioService = PortfolioService;
