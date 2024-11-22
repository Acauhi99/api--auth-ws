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
const sequelize_1 = require("../sequelize");
const kuid_1 = __importDefault(require("kuid"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("./user");
const portfolio_1 = require("./portfolio");
const transaction_1 = require("./transaction");
const stock_1 = require("./stock");
require("../domain/associations-models");
function populateDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Setup SQLite
            yield sequelize_1.sequelize.query("PRAGMA foreign_keys = OFF;");
            yield sequelize_1.sequelize.sync({ force: true });
            yield sequelize_1.sequelize.query("PRAGMA foreign_keys = ON;");
            // Create users
            const users = yield user_1.User.bulkCreate([
                {
                    id: (0, kuid_1.default)(),
                    firstName: "João",
                    lastName: "Silva",
                    email: "joao@email.com",
                    password: yield bcryptjs_1.default.hash("123456", 10),
                },
                {
                    id: (0, kuid_1.default)(),
                    firstName: "Maria",
                    lastName: "Santos",
                    email: "maria@email.com",
                    password: yield bcryptjs_1.default.hash("123456", 10),
                },
            ]);
            console.log("Usuários criados com sucesso");
            // Create stocks
            const stocks = yield stock_1.Stock.bulkCreate([
                {
                    id: (0, kuid_1.default)(),
                    type: stock_1.StockType.STOCK,
                    ticker: "PETR4",
                    currentPrice: 32.5,
                },
                {
                    id: (0, kuid_1.default)(),
                    type: stock_1.StockType.STOCK,
                    ticker: "VALE3",
                    currentPrice: 71.2,
                },
                {
                    id: (0, kuid_1.default)(),
                    type: stock_1.StockType.STOCK,
                    ticker: "ITUB4",
                    currentPrice: 27.8,
                },
            ]);
            console.log("Ações criadas com sucesso");
            // Create portfolios
            const portfolios = yield Promise.all(users.map((user) => portfolio_1.Portfolio.create({
                id: (0, kuid_1.default)(),
                userId: user.id,
                balance: 0,
            })));
            console.log("Carteiras criadas com sucesso");
            // Create transactions
            const transactions = [];
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                const portfolio = portfolios[i];
                const stock = stocks[0]; // Using PETR4 as example
                // Initial deposit
                transactions.push({
                    id: (0, kuid_1.default)(),
                    type: transaction_1.TransactionType.DEPOSIT,
                    userId: user.id,
                    portfolioId: portfolio.id,
                    amount: 10000,
                    price: 1,
                    date: new Date(2024, 0, 1),
                });
                // Buy stocks
                transactions.push({
                    id: (0, kuid_1.default)(),
                    type: transaction_1.TransactionType.BUY,
                    userId: user.id,
                    portfolioId: portfolio.id,
                    ticker: stock.ticker,
                    quantity: 100,
                    price: 30,
                    amount: 3000,
                    date: new Date(2024, 0, 15),
                });
                // Dividend payment
                transactions.push({
                    id: (0, kuid_1.default)(),
                    type: transaction_1.TransactionType.DIVIDEND,
                    userId: user.id,
                    portfolioId: portfolio.id,
                    ticker: stock.ticker,
                    amount: 100,
                    price: 1,
                    date: new Date(2024, 1, 1),
                });
                // Sell stocks
                transactions.push({
                    id: (0, kuid_1.default)(),
                    type: transaction_1.TransactionType.SELL,
                    userId: user.id,
                    portfolioId: portfolio.id,
                    ticker: stock.ticker,
                    quantity: 50,
                    price: 32,
                    amount: 1600,
                    date: new Date(2024, 2, 1),
                });
                // Withdrawal
                transactions.push({
                    id: (0, kuid_1.default)(),
                    type: transaction_1.TransactionType.WITHDRAWAL,
                    userId: user.id,
                    portfolioId: portfolio.id,
                    amount: 1000,
                    price: 1,
                    date: new Date(2024, 2, 15),
                });
            }
            yield transaction_1.Transaction.bulkCreate(transactions);
            console.log("Transações criadas com sucesso");
            // Update portfolio balances
            for (const portfolio of portfolios) {
                const userTransactions = transactions.filter((t) => t.portfolioId === portfolio.id);
                const balance = userTransactions.reduce((acc, t) => {
                    switch (t.type) {
                        case transaction_1.TransactionType.DEPOSIT:
                        case transaction_1.TransactionType.DIVIDEND:
                        case transaction_1.TransactionType.SELL:
                            return acc + Number(t.amount);
                        case transaction_1.TransactionType.WITHDRAWAL:
                        case transaction_1.TransactionType.BUY:
                            return acc - Number(t.amount);
                        default:
                            return acc;
                    }
                }, 0);
                yield portfolio.update({ balance });
            }
            console.log("Saldos das carteiras atualizados com sucesso");
            console.log("Banco de dados populado com sucesso!");
        }
        catch (error) {
            console.error("Erro ao popular banco de dados:", error);
            process.exit(1);
        }
        finally {
            yield sequelize_1.sequelize.close();
            process.exit(0);
        }
    });
}
// Start the population process
sequelize_1.sequelize
    .authenticate()
    .then(() => {
    console.log("Conectado ao banco de dados");
    populateDB();
})
    .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err);
    process.exit(1);
});
