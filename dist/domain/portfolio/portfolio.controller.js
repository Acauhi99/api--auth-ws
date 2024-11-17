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
        this.createPortfolio = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const portfolio = yield this.portfolioService.createPortfolio(userId);
                return res.status(201).json(portfolio);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Portfolio already exists") {
                        return res.status(409).json({ message: error.message });
                    }
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
            }
        });
        this.getPortfolioDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const portfolioDetails = yield this.portfolioService.getPortfolioDetails(userId);
                return res.status(200).json(portfolioDetails);
            }
            catch (error) {
                if (error instanceof Error) {
                    if (error.message === "Portfólio não encontrado") {
                        return res.status(404).json({ message: error.message });
                    }
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
            }
        });
        this.getPositions = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const positions = yield this.portfolioService.getPositions(userId);
                return res.status(200).json(positions);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
            }
        });
        this.getPerformance = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const performance = yield this.portfolioService.getPerformance(userId);
                return res.status(200).json(performance);
            }
            catch (error) {
                if (error instanceof Error) {
                    return res.status(500).json({ message: error.message });
                }
                return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
            }
        });
        this.portfolioService = new portfolio_service_1.PortfolioService();
    }
}
exports.PortfolioController = PortfolioController;
