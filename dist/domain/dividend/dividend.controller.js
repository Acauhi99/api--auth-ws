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
exports.DividendController = void 0;
const dividend_service_1 = require("./dividend.service");
class DividendController {
    constructor() {
        this.getDividends = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const dividends = yield this.dividendService.getDividendsByUserId(userId);
                return res.status(200).json(dividends);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.createDividend = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const dividendData = Object.assign(Object.assign({}, req.body), { userId });
                if (!this.isValidCreateDividendDTO(dividendData)) {
                    return res.status(400).json({
                        message: "Dados incompletos. stockId, portfolioId, amount, paymentDate e declaredDate são obrigatórios",
                    });
                }
                const newDividend = yield this.dividendService.createDividend(dividendData);
                return res.status(201).json(newDividend);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.getDividendSummary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const summary = yield this.dividendService.getDividendSummary(userId);
                return res.status(200).json(summary);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.getDividendCalendar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { month, year } = req.query;
                const calendar = yield this.dividendService.getDividendCalendar(userId, Number(month) || new Date().getMonth() + 1, Number(year) || new Date().getFullYear());
                return res.status(200).json(calendar);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.getStockDividendHistory = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.user.id;
                const { stockId } = req.params;
                if (!stockId) {
                    return res.status(400).json({ message: "Stock ID é obrigatório" });
                }
                const history = yield this.dividendService.getStockDividendHistory(userId, stockId);
                return res.status(200).json(history);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.dividendService = new dividend_service_1.DividendService();
    }
    isValidCreateDividendDTO(data) {
        return !!(data.stockId &&
            data.portfolioId &&
            data.amount &&
            data.paymentDate &&
            data.declaredDate);
    }
}
exports.DividendController = DividendController;
