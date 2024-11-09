import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 8080;
export const JWT_SECRET = process.env.JWT_SECRET;
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
export const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI;
export const API_KEY_STOCKS_DATA = process.env.API_KEY_STOCKS_DATA;
export const NODE_ENV = process.env.NODE_ENV;
