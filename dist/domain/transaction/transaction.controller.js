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
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const transaction_model_1 = require("./transaction.model");
class TransactionController {
    constructor() {
        this.handleStockTransaction = (req, res, type) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { ticker, quantity, amount, portfolioId } = req.body;
                const transactionData = {
                    type,
                    ticker,
                    quantity,
                    amount,
                    portfolioId,
                    price: amount / quantity,
                };
                if (!this.isValidStockTransaction(transactionData)) {
                    return res.status(400).json({
                        message: "Dados incompletos. 'ticker', 'quantity' e 'amount' são obrigatórios",
                    });
                }
                const transaction = yield this.transactionService.createTransaction(userId, transactionData);
                return res.status(201).json(transaction);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Saldo insuficiente" ||
                        error.message === "Quantidade insuficiente de ações") {
                        return res.status(400).json({ message: error.message });
                    }
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        });
        this.buyStock = (req, res) => {
            return this.handleStockTransaction(req, res, transaction_model_1.TransactionType.BUY);
        };
        this.sellStock = (req, res) => {
            return this.handleStockTransaction(req, res, transaction_model_1.TransactionType.SELL);
        };
        this.deposit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { amount, portfolioId } = req.body;
                const transactionData = {
                    type: transaction_model_1.TransactionType.DEPOSIT,
                    amount,
                    portfolioId,
                    price: 1,
                };
                if (!this.isValidMoneyTransaction(transactionData)) {
                    return res.status(400).json({ message: "Valor de depósito inválido" });
                }
                const transaction = yield this.transactionService.createTransaction(userId, transactionData);
                return res.status(201).json(transaction);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        });
        this.withdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { amount, portfolioId } = req.body;
                const transactionData = {
                    type: transaction_model_1.TransactionType.WITHDRAWAL,
                    amount,
                    portfolioId,
                    price: 1,
                };
                if (!this.isValidMoneyTransaction(transactionData)) {
                    return res.status(400).json({ message: "Valor de saque inválido" });
                }
                const transaction = yield this.transactionService.createTransaction(userId, transactionData);
                return res.status(201).json(transaction);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Saldo insuficiente") {
                        return res.status(400).json({ message: error.message });
                    }
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        });
        this.getTransactionHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const transactions = yield this.transactionService.getTransactionHistory(userId);
                return res.status(200).json(transactions);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Erro interno do servidor" });
            }
        });
        this.transactionService = new transaction_service_1.TransactionService();
    }
    isValidStockTransaction(data) {
        return !!(data.ticker &&
            data.quantity &&
            data.amount &&
            data.amount > 0 &&
            data.quantity > 0 &&
            data.portfolioId);
    }
    isValidMoneyTransaction(data) {
        return !!(data.amount && data.amount > 0 && data.portfolioId);
    }
}
exports.TransactionController = TransactionController;
