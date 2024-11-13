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
        this.getAllStocks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = req.query;
                const stocks = yield this.stockService.getAllStocks(filters);
                return res.status(200).json(stocks);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.createStock = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const stockData = req.body;
                if (!this.isValidCreateStockDTO(stockData)) {
                    return res.status(400).json({
                        message: "Dados incompletos. type, ticker e currentPrice são obrigatórios",
                    });
                }
                const newStock = yield this.stockService.createStock(stockData);
                return res.status(201).json(newStock);
            }
            catch (error) {
                if (error instanceof Error && error.message.includes("unique")) {
                    return res.status(400).json({ message: "Ticker já existente" });
                }
                return res.status(500).json({ message: error.message });
            }
        });
        this.getStockById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const stock = yield this.stockService.getStockById(id);
                if (!stock) {
                    return res.status(404).json({ message: "Ativo não encontrado" });
                }
                return res.status(200).json(stock);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.getStockQuote = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { ticker } = req.params;
                const quote = yield this.stockService.getStockQuote(ticker);
                if (!quote) {
                    return res.status(404).json({ message: "Cotação não encontrada" });
                }
                return res.status(200).json(quote);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.getAvailableStocks = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const search = "BR";
                const availableStocks = yield this.stockService.fetchAvailableStocks(search);
                return res.status(200).json(availableStocks);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.getQuotes = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { tickers } = req.params;
                const query = req.query;
                const tickersArray = tickers.split(",").map((ticker) => ticker.trim());
                const options = {
                    range: query.range,
                    interval: query.interval,
                    fundamental: query.fundamental === "true",
                    dividends: query.dividends === "true",
                    modules: query.modules
                        ? query.modules.split(",")
                        : undefined,
                };
                const quotes = yield this.stockService.getQuotes(tickersArray, options);
                return res.status(200).json(quotes);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.stockService = new stock_service_1.StockService();
    }
    isValidCreateStockDTO(data) {
        return !!(data.type &&
            data.ticker &&
            typeof data.currentPrice === "number");
    }
}
exports.StockController = StockController;
