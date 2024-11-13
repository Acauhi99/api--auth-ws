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
exports.WalletController = void 0;
const wallet_service_1 = require("./wallet.service");
class WalletController {
    constructor() {
        this.getWallet = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const walletSummary = yield this.walletService.getWalletSummary(userId);
                if (!walletSummary) {
                    return res.status(404).json({ message: "Carteira não encontrada" });
                }
                return res.status(200).json(walletSummary);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.deposit = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const depositData = req.body;
                if (!this.isValidMoneyOperation(depositData)) {
                    return res.status(400).json({
                        message: "Valor de depósito inválido ou dados incompletos",
                    });
                }
                const updatedWallet = yield this.walletService.deposit(userId, depositData);
                return res.status(200).json(updatedWallet);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.withdraw = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const withdrawalData = req.body;
                if (!this.isValidMoneyOperation(withdrawalData)) {
                    return res.status(400).json({
                        message: "Valor de saque inválido ou dados incompletos",
                    });
                }
                const updatedWallet = yield this.walletService.withdraw(userId, withdrawalData);
                return res.status(200).json(updatedWallet);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Saldo insuficiente") {
                        return res.status(400).json({ message: error.message });
                    }
                    if (error.message.includes("not found")) {
                        return res.status(404).json({ message: "Carteira não encontrada" });
                    }
                }
                return res.status(500).json({ message: error.message });
            }
        });
        this.getProfitability = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { month, year } = req.query;
                if (!this.isValidPeriod(month, year)) {
                    return res.status(400).json({
                        message: "Período inválido",
                    });
                }
                const profitability = yield this.walletService.getProfitability(userId, month, year);
                return res.status(200).json(profitability);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.walletService = new wallet_service_1.WalletService();
    }
    isValidMoneyOperation(data) {
        return !!(data.amount && data.amount > 0);
    }
    isValidPeriod(month, year) {
        if (!month || !year)
            return false;
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        return !!(monthNum >= 1 &&
            monthNum <= 12 &&
            yearNum >= 2000 &&
            yearNum <= new Date().getFullYear());
    }
}
exports.WalletController = WalletController;
