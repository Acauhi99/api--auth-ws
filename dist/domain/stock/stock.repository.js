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
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const stockData = Object.assign(Object.assign({}, data), { currentPrice: data.currentPrice || 0 });
            return stock_model_1.Stock.create(stockData);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const stock = yield stock_model_1.Stock.findByPk(id);
            if (!stock)
                throw new Error(`Ação com ID ${id} não encontrada no sistema`);
            return stock;
        });
    }
    findByTicker(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            return stock_model_1.Stock.findOne({ where: { ticker } });
        });
    }
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const where = {};
            if (filters.type) {
                where.type = filters.type;
            }
            if (filters.minPrice || filters.maxPrice) {
                where.currentPrice = {};
                if (filters.minPrice)
                    where.currentPrice[sequelize_1.Op.gte] = filters.minPrice;
                if (filters.maxPrice)
                    where.currentPrice[sequelize_1.Op.lte] = filters.maxPrice;
            }
            if (filters.search) {
                where.ticker = { [sequelize_1.Op.iLike]: `%${filters.search}%` };
            }
            return stock_model_1.Stock.findAll({ where });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updated] = yield stock_model_1.Stock.update(data, { where: { id } });
            if (!updated)
                throw new Error(`Não foi possível atualizar a ação com ID ${id}. Ação não encontrada.`);
        });
    }
    bulkUpdatePrices(updates) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(updates.map(({ ticker, price }) => stock_model_1.Stock.update({ currentPrice: price }, { where: { ticker } })));
        });
    }
    updateByTicker(ticker, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [updatedRows] = yield stock_model_1.Stock.update(data, {
                where: { ticker },
            });
            if (updatedRows === 0) {
                throw new Error(`Não foi possível atualizar a ação com ticker ${ticker}. Ação não encontrada.`);
            }
        });
    }
}
exports.StockRepository = StockRepository;
