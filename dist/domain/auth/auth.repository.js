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
exports.AuthRepository = void 0;
const user_model_1 = require("../user/user.model");
class AuthRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findOne({ where: { email } });
                return user;
            }
            catch (error) {
                throw new Error("Erro ao buscar usuário");
            }
        });
    }
    save(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_model_1.User.create(userData);
            }
            catch (error) {
                throw new Error("Erro ao criar usuário");
            }
        });
    }
    findByGithubId(githubId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findOne({ where: { githubId } });
                return user;
            }
            catch (error) {
                throw new Error("Erro ao buscar usuário pelo GitHub ID");
            }
        });
    }
}
exports.AuthRepository = AuthRepository;
