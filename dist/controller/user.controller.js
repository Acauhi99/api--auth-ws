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
exports.UserController = void 0;
const domain_1 = require("../domain");
class UserController {
    constructor() {
        this.getAllUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userService.getAllUsers();
                return res.status(200).json(users);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.getUserById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const user = yield this.userService.getUserById(userId);
                if (!user) {
                    return res.status(404).json({ message: "Usuário não encontrado" });
                }
                return res.status(200).json(user);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.patchUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const updatedData = req.body;
                const updatedUser = yield this.userService.patchUser(userId, updatedData);
                if (!updatedUser) {
                    return res.status(404).json({ message: "Usuário não encontrado" });
                }
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.updateUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const updatedData = req.body;
                const updatedUser = yield this.userService.updateUser(userId, updatedData);
                if (!updatedUser) {
                    return res.status(404).json({ message: "Usuário não encontrado" });
                }
                return res.status(200).json(updatedUser);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.deleteUser = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const userDeleted = yield this.userService.deleteUser(userId);
                if (!userDeleted) {
                    return res.status(404).json({ message: "Usuário não encontrado" });
                }
                return res.status(204).send();
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
        this.userService = new domain_1.UserService();
    }
}
exports.UserController = UserController;
