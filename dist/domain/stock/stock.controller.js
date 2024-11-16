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
exports.StockController = void 0;
const stock_service_1 = require("./stock.service");
class StockController {
    constructor() {
        this.getAvailableStocks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const search = req.query.search || "BR";
                const availableStocks = yield this.stockService.fetchAvailableStocks(search);
                return res.status(200).json(availableStocks);
            }
            catch (error) {
                return res.status(500).json({
                    message: "Erro ao buscar ações disponíveis",
                    error: error.message,
                });
            }
        });
        this.getStockQuote = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticker } = req.params;
                if (!ticker) {
                    return res.status(400).json({
                        message: "Ticker é obrigatório",
                    });
                }
                const quote = yield this.stockService.getStockQuote(ticker);
                if (!quote) {
                    return res.status(404).json({
                        message: "Cotação não encontrada",
                    });
                }
                return res.status(200).json(quote);
            }
            catch (error) {
                return res.status(500).json({
                    message: "Erro ao buscar cotação",
                    error: error.message,
                });
            }
        });
        this.stockService = new stock_service_1.StockService();
    }
}
exports.StockController = StockController;
