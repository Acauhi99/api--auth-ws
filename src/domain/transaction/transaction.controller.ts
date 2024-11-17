import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { TransactionType } from "./transaction.model";
import { CreateTransactionDTO } from "./dtos";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  private handleStockTransaction = async (
    req: Request,
    res: Response,
    type: TransactionType.BUY | TransactionType.SELL
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;

      const { ticker, quantity, amount, portfolioId } = req.body;

      const transactionData: CreateTransactionDTO = {
        type,
        ticker,
        quantity,
        amount,
        portfolioId,
        price: amount / quantity,
      };

      if (!this.isValidStockTransaction(transactionData)) {
        return res.status(400).json({
          message:
            "Dados incompletos. 'ticker', 'quantity' e 'amount' são obrigatórios",
        });
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );

      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        if (
          error.message === "Saldo insuficiente" ||
          error.message === "Quantidade insuficiente de ações"
        ) {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  buyStock = (req: Request, res: Response): Promise<Response> => {
    return this.handleStockTransaction(req, res, TransactionType.BUY);
  };

  sellStock = (req: Request, res: Response): Promise<Response> => {
    return this.handleStockTransaction(req, res, TransactionType.SELL);
  };

  deposit = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const { amount, portfolioId } = req.body;

      const transactionData: CreateTransactionDTO = {
        type: TransactionType.DEPOSIT,
        amount,
        portfolioId,
        price: 1,
      };

      if (!this.isValidMoneyTransaction(transactionData)) {
        return res.status(400).json({ message: "Valor de depósito inválido" });
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );

      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  withdraw = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const { amount, portfolioId } = req.body;

      const transactionData: CreateTransactionDTO = {
        type: TransactionType.WITHDRAWAL,
        amount,
        portfolioId,
        price: 1,
      };

      if (!this.isValidMoneyTransaction(transactionData)) {
        return res.status(400).json({ message: "Valor de saque inválido" });
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );

      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Saldo insuficiente") {
          return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  getTransactionHistory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const transactions = await this.transactionService.getTransactionHistory(
        userId
      );
      return res.status(200).json(transactions);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  };

  private isValidStockTransaction(
    data: Partial<CreateTransactionDTO>
  ): boolean {
    return !!(
      data.ticker &&
      data.quantity &&
      data.amount &&
      data.amount > 0 &&
      data.quantity > 0 &&
      data.portfolioId
    );
  }

  private isValidMoneyTransaction(
    data: Partial<CreateTransactionDTO>
  ): boolean {
    return !!(data.amount && data.amount > 0 && data.portfolioId);
  }
}
