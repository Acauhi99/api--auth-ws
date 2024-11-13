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
exports.WalletService = void 0;
const wallet_repository_1 = require("./wallet.repository");
const transaction_1 = require("../transaction");
const transaction_2 = require("../transaction");
class WalletService {
    constructor() {
        this.walletRepository = new wallet_repository_1.WalletRepository();
        this.transactionRepository = new transaction_1.TransactionRepository();
    }
    getWalletSummary(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.walletRepository.findByUserId(userId);
            if (!wallet) {
                throw new Error(`Carteira não encontrada para o usuário ${userId}`);
            }
            return this.walletRepository.getWalletSummary(wallet.id);
        });
    }
    deposit(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.walletRepository.findByUserId(userId);
            if (!wallet) {
                throw new Error(`Carteira não encontrada para o usuário ${userId}`);
            }
            yield this.walletRepository.update(wallet.id, {
                availableBalance: wallet.availableBalance + data.amount,
            });
            yield this.transactionRepository.create({
                type: transaction_2.TransactionType.DEPOSIT,
                amount: data.amount,
                walletId: wallet.id,
                userId,
            });
        });
    }
    withdraw(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.walletRepository.findByUserId(userId);
            if (!wallet) {
                throw new Error(`Carteira não encontrada para o usuário ${userId}`);
            }
            if (wallet.availableBalance < data.amount) {
                throw new Error(`Saldo insuficiente para saque. Saldo atual: R$ ${wallet.availableBalance.toFixed(2)}, Valor solicitado: R$ ${data.amount.toFixed(2)}`);
            }
            yield this.walletRepository.update(wallet.id, {
                availableBalance: wallet.availableBalance - data.amount,
            });
            yield this.transactionRepository.create({
                type: transaction_2.TransactionType.WITHDRAWAL,
                amount: data.amount,
                walletId: wallet.id,
                userId,
            });
        });
    }
    getProfitability(userId, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.walletRepository.findByUserId(userId);
            if (!wallet) {
                throw new Error(`Carteira não encontrada para o usuário ${userId}`);
            }
            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);
            const { transactions, appreciation } = yield this.walletRepository.calculateProfitability(wallet.id, startDate, endDate);
            const dividends = transactions
                .filter((t) => t.type === transaction_2.TransactionType.DIVIDEND)
                .reduce((sum, t) => sum + t.amount, 0);
            const trades = transactions
                .filter((t) => t.type === transaction_2.TransactionType.SELL)
                .reduce((sum, t) => sum + t.amount, 0);
            return {
                month: `${month}/${year}`,
                total: dividends + trades + appreciation,
                dividends,
                trades,
                appreciation,
            };
        });
    }
}
exports.WalletService = WalletService;
