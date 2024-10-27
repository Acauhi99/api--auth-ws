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
exports.AuthService = void 0;
const axios_1 = __importDefault(require("axios"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config");
const auth_repository_1 = require("./auth.repository");
class AuthService {
    constructor() {
        this.authRepository = new auth_repository_1.AuthRepository();
        this.githubAxios = axios_1.default.create({
            baseURL: "https://github.com/login/oauth",
            headers: { Accept: "application/json" },
        });
    }
    register(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingUser = yield this.authRepository.findByEmail(userData.email);
            if (existingUser) {
                throw new Error("Usuário já cadastrado");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(userData.password, 10);
            const newUser = Object.assign(Object.assign({}, userData), { password: hashedPassword });
            this.authRepository.save(newUser);
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.authRepository.findByEmail(email);
            if (!user) {
                throw new Error("Credenciais inválidas");
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Credenciais inválidas");
            }
            if (!config_1.JWT_SECRET) {
                throw new Error("JWT_SECRET não definido");
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, config_1.JWT_SECRET, {
                expiresIn: "1h",
            });
            return token;
        });
    }
    getGitHubAccessToken(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.githubAxios.post("/access_token", {
                client_id: config_1.GITHUB_CLIENT_ID,
                client_secret: config_1.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: config_1.GITHUB_REDIRECT_URI,
            });
            return response.data.access_token;
        });
    }
}
exports.AuthService = AuthService;
