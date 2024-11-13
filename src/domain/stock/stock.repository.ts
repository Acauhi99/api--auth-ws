import { Op } from "sequelize";
import { Stock, StockAttributes, StockCreationAttributes } from "./stock.model";
import { CreateStockDTO, StockFilterDTO } from "./dtos";

export class StockRepository {
  async create(data: CreateStockDTO): Promise<Stock> {
    const stockData: StockCreationAttributes = {
      ...data,
      currentPrice: data.currentPrice || 0,
    };
    return Stock.create(stockData);
  }

  async findById(id: string): Promise<Stock> {
    const stock = await Stock.findByPk(id);
    if (!stock) throw new Error(`Ação com ID ${id} não encontrada no sistema`);
    return stock;
  }

  async findByTicker(ticker: string): Promise<Stock | null> {
    return Stock.findOne({ where: { ticker } });
  }

  async findAll(filters: StockFilterDTO): Promise<Stock[]> {
    const where: any = {};

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.minPrice || filters.maxPrice) {
      where.currentPrice = {};
      if (filters.minPrice) where.currentPrice[Op.gte] = filters.minPrice;
      if (filters.maxPrice) where.currentPrice[Op.lte] = filters.maxPrice;
    }

    if (filters.search) {
      where.ticker = { [Op.iLike]: `%${filters.search}%` };
    }

    return Stock.findAll({ where });
  }

  async update(id: string, data: Partial<StockAttributes>): Promise<void> {
    const [updated] = await Stock.update(data, { where: { id } });
    if (!updated)
      throw new Error(
        `Não foi possível atualizar a ação com ID ${id}. Ação não encontrada.`
      );
  }

  async bulkUpdatePrices(
    updates: { ticker: string; price: number }[]
  ): Promise<void> {
    await Promise.all(
      updates.map(({ ticker, price }) =>
        Stock.update({ currentPrice: price }, { where: { ticker } })
      )
    );
  }

  async updateByTicker(
    ticker: string,
    data: Partial<StockAttributes>
  ): Promise<void> {
    const [updatedRows] = await Stock.update(data, {
      where: { ticker },
    });

    if (updatedRows === 0) {
      throw new Error(
        `Não foi possível atualizar a ação com ticker ${ticker}. Ação não encontrada.`
      );
    }
  }
}
