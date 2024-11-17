import { Portfolio } from "./portfolio.model";
import { Transaction as SequelizeTransaction } from "sequelize";

export class PortfolioRepository {
  async findByUserId(
    userId: string,
    transaction?: SequelizeTransaction
  ): Promise<Portfolio | null> {
    return Portfolio.findOne({
      where: { userId },
      transaction,
    });
  }

  async findById(
    id: string,
    transaction?: SequelizeTransaction
  ): Promise<Portfolio | null> {
    return Portfolio.findOne({
      where: { id },
      transaction,
    });
  }

  async updateBalance(
    portfolioId: string,
    newBalance: number,
    transaction?: SequelizeTransaction
  ): Promise<void> {
    await Portfolio.update(
      { balance: newBalance },
      {
        where: { id: portfolioId },
        transaction,
      }
    );
  }

  async create(
    userId: string,
    transaction?: SequelizeTransaction
  ): Promise<Portfolio> {
    return Portfolio.create(
      {
        userId,
        balance: 0,
      },
      { transaction }
    );
  }
}
