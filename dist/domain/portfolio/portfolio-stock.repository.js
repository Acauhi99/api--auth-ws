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
exports.PortfolioStockRepository = void 0;
const portfolio_stock_model_1 = require("./portfolio-stock.model");
class PortfolioStockRepository {
    addOrUpdateStock(portfolioId, stockId, quantity, averagePrice, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const [portfolioStock, created] = yield portfolio_stock_model_1.PortfolioStock.findOrCreate({
                where: { portfolioId, stockId },
                defaults: { portfolioId, stockId, quantity, averagePrice },
                transaction,
            });
            if (!created) {
                portfolioStock.quantity += quantity;
                portfolioStock.averagePrice =
                    (portfolioStock.averagePrice * (portfolioStock.quantity - quantity) +
                        averagePrice * quantity) /
                        portfolioStock.quantity;
                yield portfolioStock.save({ transaction });
            }
            return portfolioStock;
        });
    }
    removeStock(portfolioId, stockId, quantity, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const portfolioStock = yield portfolio_stock_model_1.PortfolioStock.findOne({
                where: { portfolioId, stockId },
                transaction,
            });
            if (portfolioStock) {
                portfolioStock.quantity -= quantity;
                if (portfolioStock.quantity <= 0) {
                    yield portfolioStock.destroy({ transaction });
                }
                else {
                    yield portfolioStock.save({ transaction });
                }
            }
        });
    }
    findStockInPortfolio(portfolioId, stockId, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield portfolio_stock_model_1.PortfolioStock.findOne({
                    where: { portfolioId, stockId },
                    transaction,
                });
            }
            catch (error) {
                throw new Error(`Erro ao buscar o ativo ${stockId} na carteira ${portfolioId}`);
            }
        });
    }
}
exports.PortfolioStockRepository = PortfolioStockRepository;
