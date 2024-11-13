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
exports.sequelize = exports.connectDB = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const config_1 = require("./config");
const env = config_1.DB_ENV || "development";
const configPath = path_1.default.resolve(__dirname, "./infra/config/config.json");
const configFile = fs_1.default.readFileSync(configPath, "utf-8");
const config = JSON.parse(configFile)[env];
const sequelize = new sequelize_1.Sequelize({
    dialect: config.dialect,
    storage: config.storage,
    logging: config.logging,
});
exports.sequelize = sequelize;
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        console.log("Conexão com o banco de dados estabelecida com sucesso.");
    }
    catch (error) {
        console.error("Não foi possível conectar ao banco de dados:", error);
    }
});
exports.connectDB = connectDB;
