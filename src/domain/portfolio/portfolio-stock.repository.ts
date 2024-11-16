import { PortfolioStock } from "./portfolio-stock.model";
import { Transaction as SequelizeTransaction } from "sequelize";

export class PortfolioStockRepository {
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

  async findStockInPortfolio(
    portfolioId: string,
    stockId: string,
    transaction?: SequelizeTransaction
  ): Promise<PortfolioStock | null> {
    try {
      return await PortfolioStock.findOne({
        where: { portfolioId, stockId },
        transaction,
      });
    } catch (error) {
      throw new Error(
        `Erro ao buscar o ativo ${stockId} na carteira ${portfolioId}`
      );
    }
  }
}
