import cors from "cors";
import express, { Request, Response } from "express";
import { PORT } from "./config";
import {
  authRouter,
  stockRouter,
  transactionRouter,
  userRouter,
  portfolioRouter,
} from "./domain";
import "./domain/associations-models";
import { connectDB, sequelize } from "./sequelize";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.json({ message: "Bem vindo à API" });
});

// Registro das rotas
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/stock", stockRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/portfolio", portfolioRouter);

const startServer = async () => {
  await connectDB();

  try {
    await sequelize.sync({ alter: false });
    console.log("Models sincronizados com sucesso.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Sincronizacao com o banco falhou:", error);
    process.exit(1);
  }
};

startServer();
