import cors from "cors";
import express, { Request, Response } from "express";
import { PORT } from "./config";
import { connectDB } from "./db/sequelize";
import { syncUserModel } from "./domain/user/user.service";

const app = express();

connectDB().then(() => {
  syncUserModel();
});

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Bem vindo a API de Auth" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
