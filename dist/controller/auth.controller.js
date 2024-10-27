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
exports.AuthController = void 0;
const config_1 = require("../config");
const domain_1 = require("../domain");
class AuthController {
    constructor() {
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                yield this.authService.register(userData);
                return res
                    .status(201)
                    .json({ message: "Usuário cadastrado com sucesso!" });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const token = yield this.authService.login(email, password);
                return res.status(200).json({ token });
            }
            catch (error) {
                return res.status(401).json({ message: error.message });
            }
        });
        this.githubAuth = (_, res) => __awaiter(this, void 0, void 0, function* () {
            const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${config_1.GITHUB_CLIENT_ID}&redirect_uri=${config_1.GITHUB_REDIRECT_URI}`;
            res.redirect(githubAuthURL);
        });
        this.githubCallback = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { code } = req.query;
            if (!code) {
                return res
                    .status(400)
                    .json({ message: "Código de autorização não fornecido" });
            }
            try {
                const access_token = yield this.authService.getGitHubAccessToken(code);
                return res.status(200).json({ token: access_token });
            }
            catch (error) {
                return res
                    .status(500)
                    .json({ message: "Falha na autenticação do GitHub" });
            }
        });
        this.authService = new domain_1.AuthService();
    }
}
exports.AuthController = AuthController;
