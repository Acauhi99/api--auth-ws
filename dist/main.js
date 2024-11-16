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
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const domain_1 = require("./domain");
require("./domain/associations-models");
const sequelize_1 = require("./sequelize");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express_1.default.json());
app.get("/", (_, res) => {
    res.json({ message: "Bem vindo à API de Auth" });
});
// Registro das rotas
app.use("/api/auth", domain_1.authRouter);
app.use("/api/user", domain_1.userRouter);
app.use("/api/dividend", domain_1.dividendRouter);
app.use("/api/stock", domain_1.stockRouter);
app.use("/api/transaction", domain_1.transactionRouter);
app.use("/api/portfolio", domain_1.portfolioRouter);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, sequelize_1.connectDB)();
    try {
        yield sequelize_1.sequelize.sync({ alter: true });
        console.log("Models sincronizados com sucesso.");
        app.listen(config_1.PORT, () => {
            console.log(`Server is running on http://localhost:${config_1.PORT}`);
        });
    }
    catch (error) {
        console.error("Sincronizacao com o banco falhou:", error);
        process.exit(1);
    }
});
startServer();
