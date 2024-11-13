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
const stock_repository_1 = require("./stock.repository");
const config_1 = require("../../config");
class StockService {
    constructor() {
        this.stockRepository = new stock_repository_1.StockRepository();
    }
    createStock(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateStock(data);
            return this.stockRepository.create(data);
        });
    }
    getAllStocks(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stockRepository.findAll(filters);
        });
    }
    getStockById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.stockRepository.findById(id);
        });
    }
    getStockQuote(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/quote/${ticker}`, {
                    params: { token: config_1.BRAPI_TOKEN },
                });
                const quoteData = response.data.results[0];
                const quote = {
                    symbol: quoteData.symbol,
                    currency: quoteData.currency,
                    currentPrice: quoteData.regularMarketPrice,
                    change: quoteData.regularMarketChange,
                    changePercent: quoteData.regularMarketChangePercent,
                    updatedAt: new Date(quoteData.regularMarketTime * 1000),
                };
                yield this.stockRepository.updateByTicker(ticker, {
                    currentPrice: quote.currentPrice,
                });
                return quote;
            }
            catch (error) {
                throw new Error(`Erro ao obter cotação da API externa: ${error.message}`);
            }
        });
    }
    getQuotes(tickers, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    token: config_1.BRAPI_TOKEN,
                };
                if (options.range)
                    params.range = options.range;
                if (options.interval)
                    params.interval = options.interval;
                if (options.fundamental !== undefined)
                    params.fundamental = options.fundamental;
                if (options.dividends !== undefined)
                    params.dividends = options.dividends;
                if (options.modules)
                    params.modules = options.modules.join(",");
                const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/quote/${tickers.join(",")}`, {
                    params,
                });
                return response.data;
            }
            catch (error) {
                throw new Error(`Erro ao obter cotações múltiplas: ${error.message}`);
            }
        });
    }
    fetchAvailableStocks(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = { token: config_1.BRAPI_TOKEN };
                if (search) {
                    params.search = search;
                }
                const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/api/available`, {
                    params,
                });
                return response.data;
            }
            catch (error) {
                throw new Error(`Erro ao buscar ações disponíveis: ${error.message}`);
            }
        });
    }
    syncStockPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const stocks = yield this.stockRepository.findAll({});
                const tickers = stocks.map((stock) => stock.ticker);
                const response = yield axios_1.default.get(`${config_1.BRAPI_URL}/api/quote/${tickers.join(",")}`, {
                    params: { token: config_1.BRAPI_TOKEN },
                });
                const updates = response.data.results.map((quote) => ({
                    ticker: quote.symbol,
                    price: quote.regularMarketPrice,
                }));
                yield this.stockRepository.bulkUpdatePrices(updates);
            }
            catch (error) {
                throw new Error(`Erro ao sincronizar preços das ações: ${error.message}`);
            }
        });
    }
    validateStock(data) {
        if (!data.ticker || !data.type) {
            throw new Error("Dados da ação inválidos: ticker e tipo são obrigatórios");
        }
        if (data.currentPrice !== undefined && data.currentPrice <= 0) {
            throw new Error("Preço atual da ação deve ser maior que zero");
        }
    }
}
exports.StockService = StockService;
