import { Sequelize } from "sequelize";
import path from "path";
import fs from "fs";
import { DB_ENV } from "./config";

const env = DB_ENV || "development";

const configPath = path.resolve(__dirname, "../infra/config/config.json");
const configFile = fs.readFileSync(configPath, "utf-8");
const config = JSON.parse(configFile)[env];

const sequelize = new Sequelize({
  dialect: config.dialect as any,
  storage: config.storage,
  logging: config.logging,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso.");
  } catch (error) {
    console.error("Não foi possível conectar ao banco de dados:", error);
  }
};

export { connectDB, sequelize };
