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
exports.DividendService = void 0;
const dividend_repository_1 = require("./dividend.repository");
const portfolio_1 = require("../portfolio");
const transaction_1 = require("../transaction");
const transaction_2 = require("../transaction");
class DividendService {
    constructor() {
        this.dividendRepository = new dividend_repository_1.DividendRepository();
        this.portfolioRepository = new portfolio_1.PortfolioRepository();
        this.transactionRepository = new transaction_1.TransactionRepository();
    }
    createDividend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateDividend(data);
            const portfolio = yield this.portfolioRepository.findById(data.portfolioId);
            if (!portfolio) {
                throw new Error("Carteira não encontrada");
            }
            const dividend = yield this.dividendRepository.create(Object.assign(Object.assign({}, data), { userId: portfolio.userId }));
            portfolio.balance += data.amount;
            yield this.portfolioRepository.updateBalance(portfolio.id, portfolio.balance);
            yield this.transactionRepository.create({
                type: transaction_2.TransactionType.DIVIDEND,
                amount: data.amount,
                userId: portfolio.userId,
                portfolioId: portfolio.id,
                stockId: data.stockId,
            });
            return dividend;
        });
    }
    getDividendsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dividendRepository.findByUserId(userId);
        });
    }
    getDividendSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dividendRepository.getDividendSummary(userId);
        });
    }
    getDividendCalendar(userId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dividendRepository.findUpcomingDividends(userId, month, year);
        });
    }
    getStockDividendHistory(userId, stockId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dividendRepository.findByStockId(userId, stockId);
        });
    }
    calculateMonthlyDividends(portfolioId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolio = yield this.portfolioRepository.findById(portfolioId);
            if (!portfolio)
                throw new Error("Carteira não encontrada");
            return this.dividendRepository.calculateMonthlyDividends(portfolioId, month, year);
        });
    }
    validateDividend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (data.amount <= 0) {
                throw new Error("O valor do dividendo deve ser maior que zero");
            }
            if (data.paymentDate < data.declaredDate) {
                throw new Error("A data de pagamento não pode ser anterior à data de declaração");
            }
            const portfolio = yield this.portfolioRepository.findById(data.portfolioId);
            if (!portfolio) {
                throw new Error("Carteira não encontrada");
            }
            const portfolioStock = yield this.portfolioRepository.findStockInPortfolio(data.portfolioId, data.stockId);
            if (!portfolioStock) {
                throw new Error("Ação não encontrada na carteira");
            }
        });
    }
}
exports.DividendService = DividendService;
