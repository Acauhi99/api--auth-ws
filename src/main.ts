import cors from "cors";
import express, { Request, Response } from "express";
import { PORT } from "./config";
import {
  authRouter,
  dividendRouter,
  stockRouter,
  transactionRouter,
  userRouter,
  walletRouter,
} from "./routes";

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
  res.json({ message: "Bem vindo à API de Auth" });
});

// Registro das rotas
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/dividend", dividendRouter);
app.use("/api/stock", stockRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/wallet", walletRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
