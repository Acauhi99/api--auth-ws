import { PortfolioRepository } from "./portfolio.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { Transaction, TransactionType } from "../transaction";
import { MonthlyPerformance, PortfolioOverview } from "./dtos";
import { Portfolio } from "./portfolio.model";
import { sequelize } from "../../sequelize";

export class PortfolioService {
  private portfolioRepository: PortfolioRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.portfolioRepository = new PortfolioRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createPortfolio(userId: string): Promise<Portfolio> {
    const existingPortfolio = await this.portfolioRepository.findByUserId(
      userId
    );

    if (existingPortfolio) {
      throw new Error("Portfolio already exists");
    }

    const t = await sequelize.transaction();

    try {
      const portfolio = await this.portfolioRepository.create(userId, t);
      await t.commit();
      return portfolio;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getOverview(userId: string): Promise<PortfolioOverview> {
    const portfolio = await this.portfolioRepository.findByUserId(userId);
    if (!portfolio) throw new Error("Portfolio not found");

    const transactions = await this.transactionRepository.findByUserId(userId);

    const totalInvested = transactions
      .filter((t) => t.type === TransactionType.BUY)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDividends = transactions
      .filter((t) => t.type === TransactionType.DIVIDEND)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      balance: portfolio.balance,
      totalInvested,
      totalValue: totalInvested, // Will need to calculate with current prices
      totalDividends,
    };
  }

  async getMonthlyPerformance(userId: string): Promise<MonthlyPerformance[]> {
    const transactions = await this.transactionRepository.findByUserId(userId);
    // Group by month and calculate performance
    // This is a simplified version
    return [];
  }

  async getDividendsHistory(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserIdAndType(
      userId,
      TransactionType.DIVIDEND
    );
  }

  async getPortfolioHistory(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }
}
