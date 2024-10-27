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
exports.UserRepository = void 0;
const user_model_1 = require("./user.model");
class UserRepository {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.User.findAll();
            }
            catch (error) {
                throw new Error("Erro ao buscar usuários");
            }
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.User.findByPk(userId);
            }
            catch (error) {
                throw new Error("Usuário não encontrado");
            }
        });
    }
    patchUser(userId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findByPk(userId);
                if (!user)
                    return null;
                yield user.update(updatedData);
                return user;
            }
            catch (error) {
                throw new Error("Erro ao atualizar usuário");
            }
        });
    }
    updateUser(userId, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findByPk(userId);
                if (!user)
                    return null;
                yield user.update(updatedData);
                return user;
            }
            catch (error) {
                throw new Error("Erro ao atualizar usuário");
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_model_1.User.findByPk(userId);
                if (!user)
                    return false;
                yield user.destroy();
                return true;
            }
            catch (error) {
                throw new Error("Erro ao deletar usuário");
            }
        });
    }
}
exports.UserRepository = UserRepository;
