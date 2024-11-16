import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { TransactionType } from "./transaction.model";
import {
  CreateTransactionDTO,
  TransactionFilterDTO,
  TransactionHistoryDTO,
} from "./dtos";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  getTransactions = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const filters: TransactionFilterDTO = req.query;

      const transactions =
        await this.transactionService.getTransactionsByUserId(userId, filters);

      return res.status(200).json(transactions);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  buyStock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const transactionData: CreateTransactionDTO = {
        ...req.body,
        type: TransactionType.BUY,
        portfolioId: req.body.portfolioId,
      };

      if (!this.isValidStockTransaction(transactionData)) {
        return res.status(400).json({
          message:
            "Dados incompletos. stockId, quantity e amount são obrigatórios",
        });
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );
      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof Error && error.message === "Saldo insuficiente") {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  sellStock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const transactionData: CreateTransactionDTO = {
        ...req.body,
        type: TransactionType.SELL,
        portfolioId: req.body.portfolioId,
      };

      if (!this.isValidStockTransaction(transactionData)) {
        return res.status(400).json({
          message:
            "Dados incompletos. stockId, quantity e amount são obrigatórios",
        });
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );
      return res.status(201).json(transaction);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message === "Quantidade insuficiente de ações"
      ) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  deposit = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const transactionData: CreateTransactionDTO = {
        type: TransactionType.DEPOSIT,
        amount: req.body.amount,
        portfolioId: req.body.portfolioId,
      };

      if (!this.isValidMoneyTransaction(transactionData)) {
        return res.status(400).json({
          message: "Valor de depósito inválido",
        });
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );
      return res.status(201).json(transaction);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  withdraw = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const transactionData: CreateTransactionDTO = {
        type: TransactionType.WITHDRAWAL,
        amount: req.body.amount,
        portfolioId: req.body.portfolioId,
      };

      if (!this.isValidMoneyTransaction(transactionData)) {
        return res.status(400).json({
          message: "Valor de saque inválido",
        });
      }

      const transaction = await this.transactionService.createTransaction(
        userId,
        transactionData
      );
      return res.status(201).json(transaction);
    } catch (error) {
      if (error instanceof Error && error.message === "Saldo insuficiente") {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getDetailedHistory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const filters: TransactionFilterDTO = {
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        type: req.query.type as string[],
        stockId: req.query.stockId as string,
      };

      const history: TransactionHistoryDTO[] =
        await this.transactionService.getDetailedHistory(userId, filters);

      return res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  private isValidStockTransaction(
    data: Partial<CreateTransactionDTO>
  ): boolean {
    return !!(
      data.stockId &&
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
