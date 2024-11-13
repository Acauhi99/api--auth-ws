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
const wallet_1 = require("../wallet");
const transaction_1 = require("../transaction/");
const transaction_2 = require("../transaction");
class DividendService {
    constructor() {
        this.dividendRepository = new dividend_repository_1.DividendRepository();
        this.walletRepository = new wallet_1.WalletRepository();
        this.transactionRepository = new transaction_1.TransactionRepository();
    }
    createDividend(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateDividend(data);
            const wallet = yield this.walletRepository.findById(data.walletId);
            const dividend = yield this.dividendRepository.create(Object.assign(Object.assign({}, data), { userId: wallet.userId }));
            yield this.walletRepository.update(data.walletId, {
                availableBalance: wallet.availableBalance + data.amount,
            });
            yield this.transactionRepository.create({
                type: transaction_2.TransactionType.DIVIDEND,
                amount: data.amount,
                walletId: data.walletId,
                stockId: data.stockId,
                userId: wallet.userId,
            });
            return dividend;
        });
    }
    getDividendsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dividendRepository.getDividendSummary(userId);
        });
    }
    calculateMonthlyDividends(walletId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.dividendRepository.calculateMonthlyDividends(walletId, month, year);
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
            if (data.paymentDate < new Date()) {
                throw new Error("A data de pagamento não pode estar no passado");
            }
        });
    }
}
exports.DividendService = DividendService;
