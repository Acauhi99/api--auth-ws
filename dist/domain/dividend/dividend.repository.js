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
exports.DividendRepository = void 0;
const sequelize_1 = require("sequelize");
const dividend_model_1 = require("./dividend.model");
const stock_1 = require("../stock");
class DividendRepository {
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield dividend_model_1.Dividend.create(data);
            }
            catch (error) {
                throw new Error("Erro ao criar o dividendo");
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield dividend_model_1.Dividend.findAll({
                    where: { userId },
                    include: [
                        {
                            model: stock_1.Stock,
                            attributes: ["ticker", "type"],
                        },
                    ],
                    order: [["paymentDate", "DESC"]],
                });
            }
            catch (error) {
                throw new Error("Erro ao buscar dividendos do usuário");
            }
        });
    }
    findByStockId(userId, stockId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield dividend_model_1.Dividend.findAll({
                    where: {
                        userId,
                        stockId,
                    },
                    include: [
                        {
                            model: stock_1.Stock,
                            attributes: ["ticker", "type"],
                        },
                    ],
                    order: [["paymentDate", "DESC"]],
                });
            }
            catch (error) {
                throw new Error("Erro ao buscar histórico de dividendos da ação");
            }
        });
    }
    findUpcomingDividends(userId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const startDate = new Date(year, month - 1, 1);
                const endDate = new Date(year, month, 0);
                return yield dividend_model_1.Dividend.findAll({
                    where: {
                        userId,
                        paymentDate: {
                            [sequelize_1.Op.between]: [startDate, endDate],
                        },
                    },
                    include: [
                        {
                            model: stock_1.Stock,
                            attributes: ["ticker", "type"],
                        },
                    ],
                    order: [["paymentDate", "ASC"]],
                });
            }
            catch (error) {
                throw new Error("Erro ao buscar calendário de dividendos");
            }
        });
    }
    getDividendSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dividends = yield this.findByUserId(userId);
                const totalReceived = dividends.reduce((sum, div) => sum + div.amount, 0);
                const monthlyDistributionRaw = (yield dividend_model_1.Dividend.findAll({
                    where: { userId },
                    attributes: [
                        [(0, sequelize_1.fn)("date_trunc", "month", (0, sequelize_1.col)("paymentDate")), "month"],
                        [(0, sequelize_1.fn)("sum", (0, sequelize_1.col)("amount")), "amount"],
                    ],
                    group: [(0, sequelize_1.fn)("date_trunc", "month", (0, sequelize_1.col)("paymentDate"))],
                    order: [[(0, sequelize_1.fn)("date_trunc", "month", (0, sequelize_1.col)("paymentDate")), "DESC"]],
                    raw: true,
                }));
                const stockDistributionRaw = (yield dividend_model_1.Dividend.findAll({
                    where: { userId },
                    attributes: [
                        "stockId",
                        [(0, sequelize_1.fn)("sum", (0, sequelize_1.col)("amount")), "amount"],
                        [(0, sequelize_1.col)("Stock.ticker"), "ticker"],
                    ],
                    include: [
                        {
                            model: stock_1.Stock,
                            attributes: [],
                        },
                    ],
                    group: ["stockId", "Stock.ticker"],
                    raw: true,
                }));
                return {
                    totalReceived,
                    monthlyDistribution: monthlyDistributionRaw.map((d) => ({
                        month: d.month,
                        amount: parseFloat(d.amount),
                    })),
                    stockDistribution: stockDistributionRaw.map((d) => ({
                        ticker: d.ticker,
                        amount: parseFloat(d.amount),
                    })),
                };
            }
            catch (error) {
                throw new Error("Erro ao gerar sumário de dividendos");
            }
        });
    }
    calculateMonthlyDividends(portfolioId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield dividend_model_1.Dividend.sum("amount", {
                    where: {
                        portfolioId,
                        paymentDate: {
                            [sequelize_1.Op.between]: [
                                new Date(year, month - 1, 1),
                                new Date(year, month, 0),
                            ],
                        },
                    },
                });
                return result || 0;
            }
            catch (error) {
                throw new Error("Erro ao calcular dividendos mensais");
            }
        });
    }
}
exports.DividendRepository = DividendRepository;
