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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
const stock_repository_1 = require("./stock.repository");
const stock_model_1 = require("./stock.model");
class StockService {
    constructor() {
        this.stockRepository = new stock_repository_1.StockRepository();
    }
    getCurrentPrice(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/api/quote/${ticker}`, { params: { token: config_1.BRAPI_TOKEN } });
                if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b[0])) {
                    throw new Error(`No data found for ticker: ${ticker}`);
                }
                const currentPrice = response.data.results[0].regularMarketPrice;
                yield this.stockRepository.updateByTicker(ticker, currentPrice);
                return currentPrice;
            }
            catch (error) {
                console.error(`Error fetching stock price for ${ticker}:`, error.message);
                return null;
            }
        });
    }
    createOrUpdateStock(stock, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!stock.ticker) {
                throw new Error("Ticker é obrigatório para criar ou atualizar uma ação.");
            }
            const stockData = {
                ticker: stock.ticker,
                type: stock.type || stock_model_1.StockType.STOCK,
                currentPrice: stock.currentPrice || 0,
            };
            const updatedStock = yield this.stockRepository.createOrUpdateStock(stockData, transaction);
            return updatedStock;
        });
    }
    getStockQuote(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stock = yield this.stockRepository.findByTicker(ticker);
                if (!stock) {
                    throw new Error(`Ação com ticker ${ticker} não encontrada.`);
                }
                const currentPrice = yield this.getCurrentPrice(ticker);
                if (currentPrice === null) {
                    throw new Error(`Não foi possível obter o preço atual para ${ticker}.`);
                }
                const shortName = stock.ticker;
                const stockQuote = {
                    ticker: stock.ticker,
                    type: stock.type,
                    currentPrice: Number(currentPrice),
                    shortName,
                    lastUpdated: new Date(),
                };
                return stockQuote;
            }
            catch (error) {
                console.error(`Erro em getStockQuote: ${error.message}`);
                throw error;
            }
        });
    }
    fetchAvailableStocks(search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/api/available`, { params: { token: config_1.BRAPI_TOKEN, search } });
                if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.stocks)) {
                    throw new Error("Invalid response format from BRAPI");
                }
                return {
                    stocks: response.data.stocks.map((ticker) => ({
                        symbol: ticker,
                        shortName: ticker,
                        type: ticker.endsWith("11") ? "REIT" : "STOCK",
                    })),
                };
            }
            catch (error) {
                throw new Error(`Error fetching available stocks: ${error.message}`);
            }
        });
    }
}
exports.StockService = StockService;
