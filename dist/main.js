"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const domain_1 = require("./domain");
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
app.use("/api/wallet", domain_1.walletRouter);
app.listen(config_1.PORT, () => {
    console.log(`Server is running on http://localhost:${config_1.PORT}`);
});
