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
exports.PortfolioRepository = void 0;
const portfolio_model_1 = require("./portfolio.model");
const portfolio_stock_model_1 = require("./portfolio-stock.model");
const stock_1 = require("../stock");
const transaction_1 = require("../transaction");
class PortfolioRepository {
    findByUserId(userId, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_model_1.Portfolio.findOne({
                where: { userId },
                include: [
                    {
                        model: portfolio_stock_model_1.PortfolioStock,
                        as: "portfolioStocks",
                        include: [
                            {
                                model: stock_1.Stock,
                                as: "stock",
                                attributes: ["currentPrice"],
                            },
                        ],
                    },
                ],
                transaction,
            });
        });
    }
    createPortfolio(createPortfolioDTO) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, initialBalance } = createPortfolioDTO;
            return portfolio_model_1.Portfolio.create({ userId, balance: initialBalance });
        });
    }
    updateBalance(portfolioId, newBalance, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_model_1.Portfolio.update({ balance: newBalance }, {
                where: { id: portfolioId },
                returning: true,
                transaction,
            });
        });
    }
    addOrUpdateStock(portfolioId, stockId, quantity, averagePrice, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const [portfolioStock, created] = yield portfolio_stock_model_1.PortfolioStock.findOrCreate({
                where: { portfolioId, stockId },
                defaults: { portfolioId, stockId, quantity, averagePrice },
                transaction,
            });
            if (!created) {
                portfolioStock.quantity += quantity;
                portfolioStock.averagePrice =
                    (portfolioStock.averagePrice * (portfolioStock.quantity - quantity) +
                        averagePrice * quantity) /
                        portfolioStock.quantity;
                yield portfolioStock.save({ transaction });
            }
            return portfolioStock;
        });
    }
    removeStock(portfolioId, stockId, quantity, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolioStock = yield portfolio_stock_model_1.PortfolioStock.findOne({
                where: { portfolioId, stockId },
                transaction,
            });
            if (portfolioStock) {
                portfolioStock.quantity -= quantity;
                if (portfolioStock.quantity <= 0) {
                    yield portfolioStock.destroy({ transaction });
                }
                else {
                    yield portfolioStock.save({ transaction });
                }
            }
        });
    }
    getSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield this.findByUserId(userId);
            if (!portfolio) {
                throw new Error("Portfolio não encontrado");
            }
            let totalInvestment = 0;
            let currentValue = 0;
            for (const portfolioStock of portfolio.portfolioStocks || []) {
                totalInvestment += portfolioStock.quantity * portfolioStock.averagePrice;
                if (portfolioStock.stock && portfolioStock.stock.currentPrice !== null) {
                    currentValue +=
                        portfolioStock.quantity * portfolioStock.stock.currentPrice;
                }
                else {
                    console.warn(`Preço atual não disponível para a ação com ID ${portfolioStock.stockId}`);
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
            const transactions = yield transaction_1.Transaction.findAll({
                where: { userId },
                order: [["createdAt", "ASC"]],
            });
            let investment = 0;
            let returns = 0;
            for (const transaction of transactions) {
                switch (transaction.type) {
                    case transaction_1.TransactionType.BUY:
                        investment += transaction.amount;
                        break;
                    case transaction_1.TransactionType.SELL:
                        investment -= transaction.amount;
                        returns += transaction.amount;
                        break;
                    case transaction_1.TransactionType.DEPOSIT:
                        investment += transaction.amount;
                        break;
                    case transaction_1.TransactionType.WITHDRAWAL:
                        investment -= transaction.amount;
                        break;
                    case transaction_1.TransactionType.DIVIDEND:
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
    findById(portfolioId, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_model_1.Portfolio.findOne({
                where: { id: portfolioId },
                include: [
                    {
                        model: portfolio_stock_model_1.PortfolioStock,
                        as: "portfolioStocks",
                        include: [
                            {
                                model: stock_1.Stock,
                                as: "stock",
                                attributes: ["currentPrice"],
                            },
                        ],
                    },
                ],
                transaction,
            });
        });
    }
    findStockInPortfolio(portfolioId, stockId) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_stock_model_1.PortfolioStock.findOne({
                where: { portfolioId, stockId },
            });
        });
    }
}
exports.PortfolioRepository = PortfolioRepository;
