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
        this.getTransactions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const filters = req.query;
                const transactions = yield this.transactionService.getTransactionsByUserId(userId, filters);
                return res.status(200).json(transactions);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.buyStock = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const transactionData = Object.assign(Object.assign({}, req.body), { type: transaction_model_1.TransactionType.BUY, portfolioId: req.body.portfolioId });
                if (!this.isValidStockTransaction(transactionData)) {
                    return res.status(400).json({
                        message: "Dados incompletos. stockId, quantity e amount são obrigatórios",
                    });
                }
                const transaction = yield this.transactionService.createTransaction(userId, transactionData);
                return res.status(201).json(transaction);
            }
            catch (error) {
                if (error instanceof Error && error.message === "Saldo insuficiente") {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        });
        this.sellStock = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const transactionData = Object.assign(Object.assign({}, req.body), { type: transaction_model_1.TransactionType.SELL, portfolioId: req.body.portfolioId });
                if (!this.isValidStockTransaction(transactionData)) {
                    return res.status(400).json({
                        message: "Dados incompletos. stockId, quantity e amount são obrigatórios",
                    });
                }
                const transaction = yield this.transactionService.createTransaction(userId, transactionData);
                return res.status(201).json(transaction);
            }
            catch (error) {
                if (error instanceof Error &&
                    error.message === "Quantidade insuficiente de ações") {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        });
        this.deposit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const transactionData = {
                    type: transaction_model_1.TransactionType.DEPOSIT,
                    amount: req.body.amount,
                    portfolioId: req.body.portfolioId,
                };
                if (!this.isValidMoneyTransaction(transactionData)) {
                    return res.status(400).json({
                        message: "Valor de depósito inválido",
                    });
                }
                const transaction = yield this.transactionService.createTransaction(userId, transactionData);
                return res.status(201).json(transaction);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.withdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const transactionData = {
                    type: transaction_model_1.TransactionType.WITHDRAWAL,
                    amount: req.body.amount,
                    portfolioId: req.body.portfolioId,
                };
                if (!this.isValidMoneyTransaction(transactionData)) {
                    return res.status(400).json({
                        message: "Valor de saque inválido",
                    });
                }
                const transaction = yield this.transactionService.createTransaction(userId, transactionData);
                return res.status(201).json(transaction);
            }
            catch (error) {
                if (error instanceof Error && error.message === "Saldo insuficiente") {
                    return res.status(400).json({ message: error.message });
                }
                return res.status(500).json({ message: error.message });
            }
        });
        this.getDetailedHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const filters = {
                    startDate: req.query.startDate,
                    endDate: req.query.endDate,
                    type: req.query.type,
                    stockId: req.query.stockId,
                };
                const history = yield this.transactionService.getDetailedHistory(userId, filters);
                return res.status(200).json(history);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.transactionService = new transaction_service_1.TransactionService();
    }
    isValidStockTransaction(data) {
        return !!(data.stockId &&
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
