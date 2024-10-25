import cors from "cors";
import express, { Request, Response } from "express";
import { PORT } from "./config";
import { authRoutes, userRoutes } from "./routes";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Bem vindo à API de Auth" });
});

// Registro das rotas
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
