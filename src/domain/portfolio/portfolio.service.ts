import { PortfolioRepository } from "./portfolio.repository";
import { PortfolioStockRepository } from "./portfolio-stock.repository";
import { TransactionRepository } from "../transaction";
import { StockRepository } from "../stock";
import { TransactionType } from "../transaction";
import { sequelize } from "../../sequelize";
import {
  TransactionFilterDTO,
  CreateTransactionWithUserDTO,
  CreateTransactionWithUserAndPriceDTO,
} from "../transaction/dtos";

export class PortfolioService {
  private portfolioRepository: PortfolioRepository;
  private portfolioStockRepository: PortfolioStockRepository;
  private transactionRepository: TransactionRepository;
  private stockRepository: StockRepository;

  constructor() {
    this.portfolioRepository = new PortfolioRepository();
    this.portfolioStockRepository = new PortfolioStockRepository();
    this.transactionRepository = new TransactionRepository();
    this.stockRepository = new StockRepository();
  }

  async getPortfolioByUserId(userId: string) {
    return await this.portfolioRepository.findByUserId(userId);
  }

  async deposit(userId: string, amount: number) {
    if (amount <= 0) throw new Error("O valor do depósito deve ser positivo.");

    return await sequelize.transaction(async (t) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada");

      portfolio.balance += amount;
      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance,
        t
      );

      const transactionData: CreateTransactionWithUserDTO = {
        type: TransactionType.DEPOSIT,
        amount,
        userId,
        portfolioId: portfolio.id,
      };

      await this.transactionRepository.create(transactionData, t);

      return portfolio;
    });
  }

  async withdraw(userId: string, amount: number) {
    if (amount <= 0) throw new Error("O valor da retirada deve ser positivo.");

    return await sequelize.transaction(async (t) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada");

      if (portfolio.balance < amount) {
        throw new Error("Saldo insuficiente para a retirada.");
      }

      portfolio.balance -= amount;
      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance,
        t
      );

      const transactionData: CreateTransactionWithUserDTO = {
        type: TransactionType.WITHDRAWAL,
        amount,
        userId,
        portfolioId: portfolio.id,
      };

      await this.transactionRepository.create(transactionData, t);

      return portfolio;
    });
  }

  async buyStock(userId: string, stockId: string, quantity: number) {
    return await sequelize.transaction(async (t) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada");

      const stock = await this.stockRepository.findById(stockId);
      if (!stock) throw new Error("Ação não encontrada");

      const currentPrice = stock.currentPrice;
      if (currentPrice === null)
        throw new Error("Não foi possível obter o preço da ação");

      const totalCost = quantity * currentPrice;

      if (portfolio.balance < totalCost) {
        throw new Error("Saldo insuficiente para a compra");
      }

      portfolio.balance -= totalCost;
      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance,
        t
      );

      await this.portfolioStockRepository.addOrUpdateStock(
        portfolio.id,
        stockId,
        quantity,
        currentPrice,
        t
      );

      const transactionData: CreateTransactionWithUserAndPriceDTO = {
        type: TransactionType.BUY,
        amount: totalCost,
        quantity,
        userId,
        portfolioId: portfolio.id,
        stockId,
        priceAtTransaction: currentPrice,
      };

      await this.transactionRepository.create(transactionData, t);

      return { message: "Ação comprada com sucesso" };
    });
  }

  async sellStock(userId: string, stockId: string, quantity: number) {
    return await sequelize.transaction(async (t) => {
      const portfolio = await this.portfolioRepository.findByUserId(userId, t);
      if (!portfolio) throw new Error("Carteira não encontrada");

      const portfolioStock =
        await this.portfolioStockRepository.findStockInPortfolio(
          portfolio.id,
          stockId
        );
      if (!portfolioStock) throw new Error("Ação não encontrada na carteira");

      if (portfolioStock.quantity < quantity) {
        throw new Error("Quantidade insuficiente de ações para venda");
      }

      const stock = await this.stockRepository.findById(stockId);
      if (!stock) throw new Error("Ação não encontrada");

      const currentPrice = stock.currentPrice;
      if (currentPrice === null)
        throw new Error("Não foi possível obter o preço da ação");

      const totalRevenue = quantity * currentPrice;

      portfolio.balance += totalRevenue;
      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance,
        t
      );

      await this.portfolioStockRepository.removeStock(
        portfolio.id,
        stockId,
        quantity,
        t
      );

      const transactionData: CreateTransactionWithUserAndPriceDTO = {
        type: TransactionType.SELL,
        amount: totalRevenue,
        quantity,
        userId,
        portfolioId: portfolio.id,
        stockId,
        priceAtTransaction: currentPrice,
      };

      await this.transactionRepository.create(transactionData, t);

      return { message: "Ação vendida com sucesso" };
    });
  }

  async getSummary(userId: string) {
    const portfolio = await this.portfolioRepository.findByUserId(userId);

    if (!portfolio) throw new Error("Carteira não encontrada");

    let totalInvestment = 0;
    let currentValue = 0;

    for (const portfolioStock of portfolio.portfolioStocks || []) {
      totalInvestment += portfolioStock.averagePrice * portfolioStock.quantity;
      const stock = await this.stockRepository.findById(portfolioStock.stockId);
      if (stock && stock.currentPrice !== null) {
        currentValue += stock.currentPrice * portfolioStock.quantity;
      }
    }

    const profitLoss = currentValue - totalInvestment;

    return {
      totalInvestment,
      currentValue,
      profitLoss,
      balance: portfolio.balance,
    };
  }

  async getPerformance(userId: string) {
    const filter: TransactionFilterDTO = {};

    const transactions = await this.transactionRepository.findByUserId(
      userId,
      filter
    );

    let investment = 0;
    let returns = 0;

    for (const transaction of transactions) {
      switch (transaction.type) {
        case TransactionType.BUY:
          investment += transaction.amount;
          break;
        case TransactionType.SELL:
        case TransactionType.DIVIDEND:
          returns += transaction.amount;
          break;
        default:
          break;
      }
    }

    const profitability =
      investment === 0 ? 0 : ((returns - investment) / investment) * 100;

    return {
      investment,
      returns,
      profitability,
    };
  }
}
