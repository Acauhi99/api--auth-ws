import { Portfolio } from "./portfolio.model";
import { PortfolioStock } from "./portfolio-stock.model";
import { Stock } from "../stock";
import { Transaction as SequelizeTransaction } from "sequelize";
import { Transaction, TransactionType } from "../transaction";
import { CreatePortfolioDTO } from "./dtos";

export class PortfolioRepository {
  async findByUserId(
    userId: string,
    transaction?: SequelizeTransaction
  ): Promise<Portfolio | null> {
    return Portfolio.findOne({
      where: { userId },
      include: [
        {
          model: PortfolioStock,
          as: "portfolioStocks",
          include: [
            {
              model: Stock,
              as: "stock",
              attributes: ["currentPrice"],
            },
          ],
        },
      ],
      transaction,
    });
  }

  async createPortfolio(
    createPortfolioDTO: CreatePortfolioDTO
  ): Promise<Portfolio> {
    const { userId, initialBalance } = createPortfolioDTO;
    return Portfolio.create({ userId, balance: initialBalance });
  }

  async updateBalance(
    portfolioId: string,
    newBalance: number,
    transaction?: SequelizeTransaction
  ): Promise<[number, Portfolio[]]> {
    return Portfolio.update(
      { balance: newBalance },
      {
        where: { id: portfolioId },
        returning: true,
        transaction,
      }
    );
  }

  async addOrUpdateStock(
    portfolioId: string,
    stockId: string,
    quantity: number,
    averagePrice: number,
    transaction?: SequelizeTransaction
  ): Promise<PortfolioStock> {
    const [portfolioStock, created] = await PortfolioStock.findOrCreate({
      where: { portfolioId, stockId },
      defaults: { portfolioId, stockId, quantity, averagePrice },
      transaction,
    });

    if (!created) {
      portfolioStock.quantity += quantity;
      portfolioStock.averagePrice =
        (portfolioStock.averagePrice * (portfolioStock.quantity - quantity) +
          averagePrice * quantity) /
        portfolioStock.quantity;
      await portfolioStock.save({ transaction });
    }

    return portfolioStock;
  }

  async removeStock(
    portfolioId: string,
    stockId: string,
    quantity: number,
    transaction?: SequelizeTransaction
  ): Promise<void> {
    const portfolioStock = await PortfolioStock.findOne({
      where: { portfolioId, stockId },
      transaction,
    });

    if (portfolioStock) {
      portfolioStock.quantity -= quantity;
      if (portfolioStock.quantity <= 0) {
        await portfolioStock.destroy({ transaction });
      } else {
        await portfolioStock.save({ transaction });
      }
    }
  }

  async getSummary(userId: string): Promise<{
    totalInvestment: number;
    currentValue: number;
    profitLoss: number;
    balance: number;
  }> {
    const portfolio = await this.findByUserId(userId);

    if (!portfolio) {
      throw new Error("Portfolio não encontrado");
    }

    let totalInvestment = 0;
    let currentValue = 0;

    for (const portfolioStock of portfolio.portfolioStocks || []) {
      totalInvestment += portfolioStock.quantity * portfolioStock.averagePrice;

      if (portfolioStock.stock && portfolioStock.stock.currentPrice !== null) {
        currentValue +=
          portfolioStock.quantity * portfolioStock.stock.currentPrice;
      } else {
        console.warn(
          `Preço atual não disponível para a ação com ID ${portfolioStock.stockId}`
        );
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

  async getPerformance(userId: string): Promise<{
    investment: number;
    returns: number;
    profitability: number;
  }> {
    const transactions = await Transaction.findAll({
      where: { userId },
      order: [["createdAt", "ASC"]],
    });

    let investment = 0;
    let returns = 0;

    for (const transaction of transactions) {
      switch (transaction.type) {
        case TransactionType.BUY:
          investment += transaction.amount;
          break;
        case TransactionType.SELL:
          investment -= transaction.amount;
          returns += transaction.amount;
          break;
        case TransactionType.DEPOSIT:
          investment += transaction.amount;
          break;
        case TransactionType.WITHDRAWAL:
          investment -= transaction.amount;
          break;
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

  async findById(
    portfolioId: string,
    transaction?: SequelizeTransaction
  ): Promise<Portfolio | null> {
    return Portfolio.findOne({
      where: { id: portfolioId },
      include: [
        {
          model: PortfolioStock,
          as: "portfolioStocks",
          include: [
            {
              model: Stock,
              as: "stock",
              attributes: ["currentPrice"],
            },
          ],
        },
      ],
      transaction,
    });
  }

  async findStockInPortfolio(
    portfolioId: string,
    stockId: string
  ): Promise<PortfolioStock | null> {
    return PortfolioStock.findOne({
      where: { portfolioId, stockId },
    });
  }
}
