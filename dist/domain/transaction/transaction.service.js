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
const transaction_repository_1 = require("./transaction.repository");
const wallet_1 = require("../wallet");
const stock_1 = require("../stock");
const transaction_model_1 = require("./transaction.model");
class TransactionService {
    constructor() {
        this.transactionRepository = new transaction_repository_1.TransactionRepository();
        this.walletRepository = new wallet_1.WalletRepository();
        this.stockRepository = new stock_1.StockRepository();
    }
    createTransaction(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validateTransaction(data);
            const transaction = yield this.transactionRepository.create(Object.assign(Object.assign({}, data), { userId }));
            yield this.updateWalletBalance(data);
            return transaction;
        });
    }
    validateTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (data.type) {
                case transaction_model_1.TransactionType.BUY:
                    yield this.validateBuyTransaction(data);
                    break;
                case transaction_model_1.TransactionType.SELL:
                    yield this.validateSellTransaction(data);
                    break;
                case transaction_model_1.TransactionType.WITHDRAWAL:
                    yield this.validateWithdrawal(data);
                    break;
            }
        });
    }
    validateBuyTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletBalance = yield this.transactionRepository.getWalletBalance(data.walletId);
            if (walletBalance < data.amount) {
                throw new Error(`Saldo insuficiente na carteira para realizar a compra. Saldo atual: R$ ${walletBalance.toFixed(2)}, Valor necessário: R$ ${data.amount.toFixed(2)}`);
            }
            const stock = yield this.stockRepository.findById(data.stockId);
            if (!stock) {
                throw new Error(`Ação não encontrada no sistema (ID: ${data.stockId})`);
            }
        });
    }
    validateSellTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockBalance = yield this.transactionRepository.getStockTransactionBalance(data.walletId, data.stockId);
            if (stockBalance < data.quantity) {
                throw new Error(`Quantidade insuficiente de ações para venda. Quantidade disponível: ${stockBalance}, Quantidade solicitada: ${data.quantity}`);
            }
        });
    }
    validateWithdrawal(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletBalance = yield this.transactionRepository.getWalletBalance(data.walletId);
            if (walletBalance < data.amount) {
                throw new Error(`Saldo insuficiente para realizar o saque. Saldo atual: R$ ${walletBalance.toFixed(2)}, Valor do saque: R$ ${data.amount.toFixed(2)}`);
            }
        });
    }
    updateWalletBalance(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.walletRepository.findById(data.walletId);
            let newBalance = wallet.availableBalance;
            switch (data.type) {
                case transaction_model_1.TransactionType.DEPOSIT:
                case transaction_model_1.TransactionType.SELL:
                case transaction_model_1.TransactionType.DIVIDEND:
                    newBalance += data.amount;
                    break;
                case transaction_model_1.TransactionType.WITHDRAWAL:
                case transaction_model_1.TransactionType.BUY:
                    newBalance -= data.amount;
                    break;
            }
            yield this.walletRepository.update(data.walletId, {
                availableBalance: newBalance,
            });
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
                    price: tx.amount / (tx.quantity || 1),
                    total: tx.amount,
                    balance,
                };
            });
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
