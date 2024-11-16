import { Transaction as SequelizeTransaction } from "sequelize";
import { sequelize } from "../../sequelize";
import { TransactionRepository } from "./transaction.repository";
import { PortfolioRepository } from "../portfolio";
import { PortfolioStockRepository } from "../portfolio";
import { StockRepository } from "../stock";
import {
  CreateTransactionDTO,
  TransactionFilterDTO,
  TransactionHistoryDTO,
} from "./dtos";
import {
  Transaction,
  TransactionType,
  TransactionWithStock,
} from "./transaction.model";

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private portfolioRepository: PortfolioRepository;
  private portfolioStockRepository: PortfolioStockRepository;
  private stockRepository: StockRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.portfolioRepository = new PortfolioRepository();
    this.portfolioStockRepository = new PortfolioStockRepository();
    this.stockRepository = new StockRepository();
  }

  async createTransaction(
    userId: string,
    data: CreateTransactionDTO
  ): Promise<Transaction> {
    const transaction = await this.transactionRepository.create({
      ...data,
      userId,
    });
    return transaction;
  }

  async getTransactionsByUserId(
    userId: string,
    filter: TransactionFilterDTO
  ): Promise<TransactionWithStock[]> {
    return this.transactionRepository.findByUserId(userId, filter);
  }

  async getDetailedHistory(
    userId: string,
    filter: TransactionFilterDTO
  ): Promise<TransactionHistoryDTO[]> {
    const transactions = await this.getTransactionsByUserId(userId, filter);
    let balance = 0;

    return transactions.map((tx) => {
      balance += this.calculateBalanceImpact(tx);

      return {
        date: tx.createdAt,
        type: tx.type,
        stockTicker: tx.stock?.ticker,
        quantity: tx.quantity,
        price: tx.quantity ? tx.amount / tx.quantity : 0,
        total: tx.amount,
        balance,
      };
    });
  }

  async buyStock(
    userId: string,
    stockId: string,
    quantity: number
  ): Promise<Transaction> {
    if (quantity <= 0) throw new Error("A quantidade deve ser maior que zero.");

    return await sequelize.transaction(async (t: SequelizeTransaction) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada.");

      const stock = await this.stockRepository.findById(stockId);
      if (!stock) throw new Error("Ação não encontrada.");

      const currentPrice = stock.currentPrice;
      if (currentPrice === null || currentPrice === undefined)
        throw new Error("Preço atual da ação não disponível.");

      const totalAmount = currentPrice * quantity;
      if (portfolio.balance < totalAmount)
        throw new Error("Saldo insuficiente para a compra.");

      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance - totalAmount,
        t
      );

      await this.portfolioStockRepository.addOrUpdateStock(
        portfolio.id,
        stockId,
        quantity,
        currentPrice,
        t
      );

      const transaction = await this.transactionRepository.create(
        {
          type: TransactionType.BUY,
          amount: totalAmount,
          quantity,
          userId,
          portfolioId: portfolio.id,
          stockId,
        },
        t
      );

      return transaction;
    });
  }

  async sellStock(
    userId: string,
    stockId: string,
    quantity: number
  ): Promise<Transaction> {
    if (quantity <= 0) throw new Error("A quantidade deve ser maior que zero.");

    return await sequelize.transaction(async (t: SequelizeTransaction) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada.");

      const portfolioStock =
        await this.portfolioStockRepository.findStockInPortfolio(
          portfolio.id,
          stockId,
          t
        );
      if (!portfolioStock || portfolioStock.quantity < quantity) {
        throw new Error("Quantidade insuficiente de ações para venda.");
      }

      const stock = await this.stockRepository.findById(stockId);
      if (!stock) throw new Error("Ação não encontrada.");

      const currentPrice = stock.currentPrice;
      if (currentPrice === null || currentPrice === undefined)
        throw new Error("Preço atual da ação não disponível.");

      const totalAmount = currentPrice * quantity;

      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance + totalAmount,
        t
      );

      await this.portfolioStockRepository.removeStock(
        portfolio.id,
        stockId,
        quantity,
        t
      );

      const transaction = await this.transactionRepository.create(
        {
          type: TransactionType.SELL,
          amount: totalAmount,
          quantity,
          userId,
          portfolioId: portfolio.id,
          stockId,
        },
        t
      );

      return transaction;
    });
  }

  async deposit(userId: string, amount: number): Promise<Transaction> {
    if (amount <= 0) throw new Error("O valor do depósito deve ser positivo.");

    return await sequelize.transaction(async (t: SequelizeTransaction) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada.");

      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance + amount,
        t
      );

      const transaction = await this.transactionRepository.create(
        {
          type: TransactionType.DEPOSIT,
          amount,
          userId,
          portfolioId: portfolio.id,
        },
        t
      );

      return transaction;
    });
  }

  async withdraw(userId: string, amount: number): Promise<Transaction> {
    if (amount <= 0) throw new Error("O valor da retirada deve ser positivo.");

    return await sequelize.transaction(async (t: SequelizeTransaction) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada.");

      if (portfolio.balance < amount)
        throw new Error("Saldo insuficiente para a retirada.");

      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance - amount,
        t
      );

      const transaction = await this.transactionRepository.create(
        {
          type: TransactionType.WITHDRAWAL,
          amount,
          userId,
          portfolioId: portfolio.id,
        },
        t
      );

      return transaction;
    });
  }

  private calculateBalanceImpact(transaction: Transaction): number {
    switch (transaction.type) {
      case TransactionType.DEPOSIT:
      case TransactionType.SELL:
      case TransactionType.DIVIDEND:
        return transaction.amount;
      case TransactionType.WITHDRAWAL:
      case TransactionType.BUY:
        return -transaction.amount;
      default:
        return 0;
    }
  }
}
