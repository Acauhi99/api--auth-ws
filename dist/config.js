"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_ENV = exports.BRAPI_URL = exports.BRAPI_TOKEN = exports.GITHUB_REDIRECT_URI = exports.GITHUB_CLIENT_SECRET = exports.GITHUB_CLIENT_ID = exports.JWT_SECRET = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
exports.GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
exports.GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
exports.BRAPI_TOKEN = process.env.BRAPI_TOKEN;
exports.BRAPI_URL = process.env.BRAPI_URL;
exports.DB_ENV = process.env.DB_ENV;
