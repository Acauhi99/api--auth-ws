import { PortfolioRepository } from "./portfolio.repository";
import { TransactionRepository } from "../transaction/transaction.repository";
import { TransactionType } from "../transaction";
import { Portfolio } from "./portfolio.model";
import { sequelize } from "../../sequelize";
import { StockService } from "../stock";
import { Position, StockInfo, Performance } from "./dtos";

export class PortfolioService {
  private portfolioRepository: PortfolioRepository;
  private transactionRepository: TransactionRepository;
  private stockService: StockService;

  constructor() {
    this.portfolioRepository = new PortfolioRepository();
    this.transactionRepository = new TransactionRepository();
    this.stockService = new StockService();
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

  async getPortfolioDetails(userId: string): Promise<Portfolio> {
    const portfolio = await this.portfolioRepository.findByUserId(userId);
    if (!portfolio) {
      throw new Error("Portfólio não encontrado");
    }
    return portfolio;
  }

  async getPositions(userId: string): Promise<Position[]> {
    const portfolio = await this.portfolioRepository.findByUserId(userId);
    if (!portfolio) {
      throw new Error("Portfólio não encontrado");
    }

    const transactions =
      await this.transactionRepository.findByPortfolioIdAndType(portfolio.id, [
        TransactionType.BUY,
        TransactionType.SELL,
      ]);

    const positionsMap = this.calculatePositions(transactions);
    const validPositions = this.filterValidPositions(positionsMap);

    if (validPositions.length === 0) {
      return [];
    }

    const prices = await this.getCurrentPrices(
      validPositions.map((pos) => pos.ticker)
    );

    return this.combinePositionsWithPrices(validPositions, prices);
  }

  async getPerformance(userId: string): Promise<Performance> {
    const portfolio = await this.portfolioRepository.findByUserId(userId);
    if (!portfolio) {
      throw new Error("Portfólio não encontrado");
    }

    const oneMonthAgo = this.getDateOneMonthAgo();

    const transactions =
      await this.transactionRepository.findByPortfolioIdAfterDate(
        portfolio.id,
        oneMonthAgo,
        [TransactionType.BUY, TransactionType.SELL, TransactionType.DIVIDEND]
      );

    const { totalInvested, totalGains, totalDividends } =
      this.calculateFinancials(transactions);

    const currentPositions = await this.getPositions(userId);
    const currentTotalValue = this.calculateCurrentTotalValue(currentPositions);

    const appreciation = currentTotalValue - totalInvested;

    const profitability = this.calculateProfitability(
      totalGains,
      totalDividends,
      appreciation,
      totalInvested
    );

    return {
      totalInvested: this.formatNumber(totalInvested, 2),
      totalGains: this.formatNumber(totalGains, 2),
      totalDividends: this.formatNumber(totalDividends, 2),
      currentTotalValue: this.formatNumber(currentTotalValue, 2),
      appreciation: this.formatNumber(appreciation, 2),
      profitability: `${this.formatNumber(profitability, 2)}%`,
    };
  }

  private async getCurrentPrices(tickers: string[]): Promise<StockInfo[]> {
    const prices = await Promise.all(
      tickers.map(async (ticker) => {
        try {
          const stockInfo = await this.stockService.getStockInfo(ticker);
          return {
            symbol: stockInfo.symbol,
            currentPrice: stockInfo.currentPrice,
          };
        } catch (error) {
          console.error(`Erro ao obter preço para ${ticker}:`, error);
          return {
            symbol: ticker,
            currentPrice: null,
          };
        }
      })
    );

    return prices;
  }

  private calculatePositions(transactions: any[]): Record<string, number> {
    const positionsMap: Record<string, number> = {};

    transactions.forEach((tx) => {
      if (tx.ticker && tx.quantity) {
        positionsMap[tx.ticker] =
          (positionsMap[tx.ticker] || 0) +
          (tx.type === TransactionType.BUY ? tx.quantity : -tx.quantity);
      }
    });

    return positionsMap;
  }

  private filterValidPositions(
    positionsMap: Record<string, number>
  ): { ticker: string; quantity: number }[] {
    return Object.entries(positionsMap)
      .filter(([_, quantity]) => quantity > 0)
      .map(([ticker, quantity]) => ({ ticker, quantity }));
  }

  private combinePositionsWithPrices(
    validPositions: { ticker: string; quantity: number }[],
    prices: StockInfo[]
  ): Position[] {
    return validPositions.map((pos) => {
      const priceInfo = prices.find((p) => p.symbol === pos.ticker);
      return {
        ticker: pos.ticker,
        quantity: pos.quantity,
        currentPrice: priceInfo ? priceInfo.currentPrice : null,
        totalValue:
          priceInfo && priceInfo.currentPrice !== null
            ? parseFloat((pos.quantity * priceInfo.currentPrice).toFixed(1))
            : null,
      };
    });
  }

  private getDateOneMonthAgo(): Date {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date;
  }

  private calculateFinancials(transactions: any[]): {
    totalInvested: number;
    totalGains: number;
    totalDividends: number;
  } {
    let totalInvested = 0;
    let totalGains = 0;
    let totalDividends = 0;

    transactions.forEach((tx) => {
      switch (tx.type) {
        case TransactionType.BUY:
          totalInvested += Number(tx.amount);
          break;
        case TransactionType.SELL:
          totalGains += Number(tx.amount);
          break;
        case TransactionType.DIVIDEND:
          totalDividends += Number(tx.amount);
          break;
        default:
          break;
      }
    });

    return { totalInvested, totalGains, totalDividends };
  }

  private calculateCurrentTotalValue(currentPositions: Position[]): number {
    return currentPositions.reduce(
      (acc, pos) => acc + (pos.totalValue || 0),
      0
    );
  }

  private calculateProfitability(
    totalGains: number,
    totalDividends: number,
    appreciation: number,
    totalInvested: number
  ): number {
    return ((totalGains + totalDividends + appreciation) / totalInvested) * 100;
  }

  private formatNumber(value: number, decimals: number): string {
    return value.toFixed(decimals);
  }
}
