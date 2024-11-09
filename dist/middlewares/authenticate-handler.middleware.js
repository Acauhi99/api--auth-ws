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
exports.authenticateHandler = void 0;
const strategies_1 = require("./strategies");
const strategies = {
    Bearer: new strategies_1.BearerStrategy(),
    GitHub: new strategies_1.GitHubStrategy(),
};
const authenticateHandler = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        res.status(401).json({ message: "Token não fornecido" });
        return;
    }
    const [scheme, token] = authHeader.split(" ");
    if (!token) {
        res.status(401).json({ message: "Formato de token inválido" });
        return;
    }
    const strategy = strategies[scheme];
    if (!strategy) {
        res.status(401).json({ message: "Esquema de autenticação inválido" });
        return;
    }
    try {
        const user = yield strategy.authenticate(token);
        req.user = user;
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token inválido ou expirado" });
    }
});
exports.authenticateHandler = authenticateHandler;
