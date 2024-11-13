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
exports.WalletRepository = void 0;
const sequelize_1 = require("sequelize");
const wallet_model_1 = require("./wallet.model");
const wallet_stock_model_1 = require("./wallet-stock.model");
const stock_1 = require("../stock");
const transaction_1 = require("../transaction");
class WalletRepository {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield wallet_model_1.Wallet.findByPk(id);
            if (!wallet)
                throw new Error("Wallet not found");
            return wallet;
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return wallet_model_1.Wallet.findOne({ where: { userId } });
        });
    }
    create(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return wallet_model_1.Wallet.create({
                userId,
                availableBalance: 0,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield wallet_model_1.Wallet.update(data, { where: { id } });
        });
    }
    getWalletSummary(walletId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const wallet = (yield wallet_model_1.Wallet.findByPk(walletId, {
                include: [
                    {
                        model: wallet_stock_model_1.WalletStock,
                        include: [{ model: stock_1.Stock }],
                    },
                ],
            }));
            if (!wallet)
                throw new Error("Wallet not found");
            const stocks = ((_a = wallet.WalletStocks) === null || _a === void 0 ? void 0 : _a.map((position) => ({
                ticker: position.Stock.ticker,
                quantity: position.quantity,
                averagePrice: position.averagePurchasePrice,
                currentPrice: position.Stock.currentPrice,
                profitability: ((position.Stock.currentPrice - position.averagePurchasePrice) /
                    position.averagePurchasePrice) *
                    100,
            }))) || [];
            const totalInvested = stocks.reduce((sum, stock) => sum + stock.quantity * stock.averagePrice, 0);
            const totalBalance = stocks.reduce((sum, stock) => sum + stock.quantity * stock.currentPrice, 0) + wallet.availableBalance;
            const totalProfitability = totalInvested > 0
                ? ((totalBalance - totalInvested) / totalInvested) * 100
                : 0;
            return {
                totalBalance,
                totalInvested,
                totalDividends: 0,
                totalProfitability,
                stocks,
            };
        });
    }
    calculateProfitability(walletId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = yield transaction_1.Transaction.findAll({
                where: {
                    walletId,
                    createdAt: {
                        [sequelize_1.Op.between]: [startDate, endDate],
                    },
                },
            });
            const positions = (yield wallet_stock_model_1.WalletStock.findAll({
                where: { walletId },
                include: [{ model: stock_1.Stock }],
            }));
            const appreciation = positions.reduce((sum, position) => {
                const currentValue = position.quantity * position.Stock.currentPrice;
                const costBasis = position.quantity * position.averagePurchasePrice;
                return sum + (currentValue - costBasis);
            }, 0);
            return {
                transactions,
                appreciation,
            };
        });
    }
}
exports.WalletRepository = WalletRepository;
