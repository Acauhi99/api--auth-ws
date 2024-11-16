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
exports.PortfolioController = void 0;
const portfolio_service_1 = require("./portfolio.service");
class PortfolioController {
    constructor() {
        this.portfolioService = new portfolio_service_1.PortfolioService();
    }
    getPortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const portfolio = yield this.portfolioService.getPortfolioByUserId(userId);
            res.json(portfolio);
        });
    }
    addStockToPortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const addStockDTO = req.body;
            if (!addStockDTO.stockId || !addStockDTO.quantity) {
                return res
                    .status(400)
                    .json({ message: "stockId e quantity são obrigatórios." });
            }
            try {
                const result = yield this.portfolioService.buyStock(userId, addStockDTO.stockId, addStockDTO.quantity);
                res.status(201).json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    removeStockFromPortfolio(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            const { stockId } = req.params;
            const { quantity } = req.body;
            if (!stockId || !quantity) {
                return res
                    .status(400)
                    .json({ message: "stockId e quantity são obrigatórios." });
            }
            try {
                const result = yield this.portfolioService.sellStock(userId, stockId, quantity);
                res.json(result);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getPortfolioSummary(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            try {
                const summary = yield this.portfolioService.getSummary(userId);
                res.json(summary);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
    getPortfolioPerformance(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user.id;
            try {
                const performance = yield this.portfolioService.getPerformance(userId);
                res.json(performance);
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.PortfolioController = PortfolioController;
