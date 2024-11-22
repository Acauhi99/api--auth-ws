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
    getAvailableStocks(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stocks = yield this.fetchBrapiAvailableStocks(search);
                const brazilianStocks = this.filterBrazilianTickers(stocks);
                yield this.syncStocksWithDatabase(brazilianStocks);
                return {
                    stocks: brazilianStocks.map((stock) => ({
                        symbol: stock.ticker,
                        shortName: stock.ticker,
                        type: stock.type,
                    })),
                };
            }
            catch (error) {
                throw new Error(`Erro ao buscar ativos disponíveis: ${error.message}`);
            }
        });
    }
    getStockInfo(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!ticker)
                    throw new Error("Ticker é obrigatório");
                const formattedTicker = ticker.toUpperCase().trim();
                const stockData = yield this.fetchBrapiStockQuote(formattedTicker);
                const mockDividends = this.generateMockDividends(formattedTicker);
                const stockQuote = this.mapToStockQuoteDTO(stockData, mockDividends);
                yield this.stockRepository.updateByTicker(formattedTicker, stockQuote.currentPrice);
                return stockQuote;
            }
            catch (error) {
                console.error("Erro ao buscar informações do ativo:", error);
                throw error;
            }
        });
    }
    fetchBrapiAvailableStocks(search) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/api/available`, { params: { token: config_1.BRAPI_TOKEN, search } });
            if (!((_a = response.data) === null || _a === void 0 ? void 0 : _a.stocks)) {
                throw new Error("Formato de resposta inválido da BRAPI");
            }
            return response.data.stocks;
        });
    }
    fetchBrapiStockQuote(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/api/quote/${ticker}`, {
                    params: {
                        token: config_1.BRAPI_TOKEN,
                        range: "1mo",
                        interval: "1d",
                        fundamental: true,
                    },
                    validateStatus: (status) => status === 200,
                });
                if (!((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a.results) === null || _b === void 0 ? void 0 : _b[0])) {
                    throw new Error(`Nenhum dado encontrado para o ticker: ${ticker}`);
                }
                return response.data.results[0];
            }
            catch (apiError) {
                const mensagem = ((_d = (_c = apiError.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || apiError.message;
                const codigo = (_e = apiError.response) === null || _e === void 0 ? void 0 : _e.status;
                throw new Error(`Erro na API BRAPI (${codigo}): ${mensagem} para o ticker ${ticker}`);
            }
        });
    }
    syncStocksWithDatabase(stocks) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingStocks = yield this.stockRepository.findByTickers(stocks.map((stock) => stock.ticker));
            const existingTickers = new Set(existingStocks.map((stock) => stock.ticker));
            const missingStocks = stocks.filter((stock) => !existingTickers.has(stock.ticker));
            if (missingStocks.length > 0) {
                yield this.stockRepository.bulkCreate(missingStocks);
            }
        });
    }
    mapToStockQuoteDTO(stockData, dividends) {
        return {
            symbol: stockData.symbol,
            shortName: stockData.shortName,
            currentPrice: stockData.regularMarketPrice,
            previousClose: stockData.regularMarketPreviousClose,
            priceChange: stockData.regularMarketChange,
            priceChangePercent: stockData.regularMarketChangePercent,
            updatedAt: new Date(stockData.regularMarketTime),
            historicalData: (stockData.historicalDataPrice || []).map((item) => ({
                date: new Date(item.date * 1000),
                open: item.open,
                high: item.high,
                low: item.low,
                close: item.close,
                volume: item.volume,
            })),
            dividends,
        };
    }
    filterBrazilianTickers(tickers) {
        const brStockPattern = /^[A-Z]{4}[3-8]$/;
        const fiiFundPattern = /^[A-Z]{4}11$/;
        return tickers
            .filter((ticker) => brStockPattern.test(ticker) || fiiFundPattern.test(ticker))
            .map((ticker) => ({
            ticker,
            type: ticker.endsWith("11") ? stock_model_1.StockType.REIT : stock_model_1.StockType.STOCK,
            currentPrice: 0,
        }));
    }
    generateMockDividends(ticker) {
        const now = new Date();
        const mockDividends = [];
        for (let i = 0; i < 4; i++) {
            const paymentDate = new Date(now);
            paymentDate.setMonth(now.getMonth() - i * 3);
            mockDividends.push({
                paymentDate,
                rate: Number((Math.random() * 1.5 + 0.5).toFixed(2)),
                type: "DIVIDENDO",
                relatedTo: `${Math.floor((12 - i * 3) / 3)}º Trimestre/${now.getFullYear()}`,
            });
        }
        return mockDividends;
    }
}
exports.StockService = StockService;
