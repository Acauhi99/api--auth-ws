import { Op } from "sequelize";
import { Stock, StockCreationAttributes } from "./stock.model";
import { Transaction as SequelizeTransaction } from "sequelize";

export class StockRepository {
  async findByTicker(ticker: string): Promise<Stock | null> {
    return Stock.findOne({ where: { ticker } });
  }

  async findByTickers(tickers: string[]): Promise<Stock[]> {
    return Stock.findAll({
      where: { ticker: { [Op.in]: tickers } },
    });
  }

  async updateByTicker(ticker: string, price: number): Promise<void> {
    await Stock.update({ currentPrice: price }, { where: { ticker } });
  }

  async bulkUpdatePrices(
    updates: { ticker: string; price: number }[]
  ): Promise<void> {
    await Promise.all(
      updates.map(({ ticker, price }) => this.updateByTicker(ticker, price))
    );
  }

  async bulkCreate(stocks: StockCreationAttributes[]): Promise<Stock[]> {
    return Stock.bulkCreate(stocks, {
      ignoreDuplicates: true,
      returning: true,
    });
  }

  async createOrUpdateStock(
    stock: StockCreationAttributes,
    transaction?: SequelizeTransaction
  ): Promise<Stock> {
    const [updatedStock, created] = await Stock.findOrCreate({
      where: { ticker: stock.ticker },
      defaults: stock,
      transaction,
    });

    if (!created) {
      await updatedStock.update(stock, { transaction });
    }

    return updatedStock;
  }

  async findById(stockId: string): Promise<Stock | null> {
    try {
      return await Stock.findByPk(stockId);
    } catch (error) {
      throw new Error(`Erro ao buscar a ação com ID ${stockId}`);
    }
  }
}
