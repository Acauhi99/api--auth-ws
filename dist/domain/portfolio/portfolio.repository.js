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
exports.PortfolioRepository = void 0;
const portfolio_model_1 = require("./portfolio.model");
class PortfolioRepository {
    findByUserId(userId, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_model_1.Portfolio.findOne({
                where: { userId },
                transaction,
            });
        });
    }
    findById(id, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_model_1.Portfolio.findOne({
                where: { id },
                transaction,
            });
        });
    }
    updateBalance(portfolioId, newBalance, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield portfolio_model_1.Portfolio.update({ balance: newBalance }, {
                where: { id: portfolioId },
                transaction,
            });
        });
    }
    create(userId, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return portfolio_model_1.Portfolio.create({
                userId,
                balance: 0,
            }, { transaction });
        });
    }
}
exports.PortfolioRepository = PortfolioRepository;
