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
exports.StockRepository = void 0;
const sequelize_1 = require("sequelize");
const stock_model_1 = require("./stock.model");
class StockRepository {
    findByTicker(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            return stock_model_1.Stock.findOne({ where: { ticker } });
        });
    }
    findByTickers(tickers) {
        return __awaiter(this, void 0, void 0, function* () {
            return stock_model_1.Stock.findAll({
                where: { ticker: { [sequelize_1.Op.in]: tickers } },
            });
        });
    }
    updateByTicker(ticker, price) {
        return __awaiter(this, void 0, void 0, function* () {
            yield stock_model_1.Stock.update({ currentPrice: price }, { where: { ticker } });
        });
    }
    bulkUpdatePrices(updates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(updates.map(({ ticker, price }) => this.updateByTicker(ticker, price)));
        });
    }
    createOrUpdateStock(stock, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedStock, created] = yield stock_model_1.Stock.findOrCreate({
                where: { ticker: stock.ticker },
                defaults: stock,
                transaction,
            });
            if (!created) {
                yield updatedStock.update(stock, { transaction });
            }
            return updatedStock;
        });
    }
    findById(stockId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield stock_model_1.Stock.findByPk(stockId);
            }
            catch (error) {
                throw new Error(`Erro ao buscar a ação com ID ${stockId}`);
            }
        });
    }
}
exports.StockRepository = StockRepository;
