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
            const search = req.query.search;
            const stocks = yield this.stockService.getAvailableStocks(search);
            res.json(stocks);
        });
        this.getStockInfo = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const ticker = req.params.ticker;
            const stock = yield this.stockService.getStockInfo(ticker);
            res.json(stock);
        });
        this.stockService = new stock_service_1.StockService();
    }
}
exports.StockController = StockController;
