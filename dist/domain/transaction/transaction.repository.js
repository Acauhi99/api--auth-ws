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
exports.TransactionRepository = void 0;
const transaction_model_1 = require("./transaction.model");
const transaction_model_2 = require("./transaction.model");
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
class TransactionRepository {
    create(data, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return transaction_model_1.Transaction.create(data, { transaction });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return transaction_model_1.Transaction.findAll({
                where: { userId },
                order: [["date", "DESC"]],
                include: ["stock"],
            });
        });
    }
    getCurrentPosition(userId, ticker, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = (yield transaction_model_1.Transaction.findAll({
                where: {
                    userId,
                    ticker,
                    type: {
                        [sequelize_1.Op.in]: [transaction_model_2.TransactionType.BUY, transaction_model_2.TransactionType.SELL],
                    },
                },
                attributes: [
                    [
                        sequelize_2.default.fn("SUM", sequelize_2.default.literal("CASE WHEN type = 'BUY' THEN quantity ELSE -quantity END")),
                        "total",
                    ],
                ],
                transaction,
                raw: true,
            }));
            return Number(((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0);
        });
    }
    findByUserIdAndType(userId, type, transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            return transaction_model_1.Transaction.findAll({
                where: {
                    userId,
                    type,
                },
                order: [["date", "DESC"]],
                include: ["stock"],
                transaction,
            });
        });
    }
}
exports.TransactionRepository = TransactionRepository;
