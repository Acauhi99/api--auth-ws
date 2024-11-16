import { Op, fn, col } from "sequelize";
import { Dividend } from "./dividend.model";
import { Stock } from "../stock";
import { CreateDividendDTO, DividendSummaryDTO } from "./dtos";

export interface MonthlyDistributionResult {
  month: string;
  amount: string;
}

export interface StockDistributionResult {
  stockId: string;
  amount: string;
  ticker: string;
}

export class DividendRepository {
  async create(
    data: CreateDividendDTO & { userId: string }
  ): Promise<Dividend> {
    try {
      return await Dividend.create(data);
    } catch (error) {
      throw new Error("Erro ao criar o dividendo");
    }
  }

  async findByUserId(userId: string): Promise<Dividend[]> {
    try {
      return await Dividend.findAll({
        where: { userId },
        include: [
          {
            model: Stock,
            attributes: ["ticker", "type"],
          },
        ],
        order: [["paymentDate", "DESC"]],
      });
    } catch (error) {
      throw new Error("Erro ao buscar dividendos do usuário");
    }
  }

  async findByStockId(userId: string, stockId: string): Promise<Dividend[]> {
    try {
      return await Dividend.findAll({
        where: {
          userId,
          stockId,
        },
        include: [
          {
            model: Stock,
            attributes: ["ticker", "type"],
          },
        ],
        order: [["paymentDate", "DESC"]],
      });
    } catch (error) {
      throw new Error("Erro ao buscar histórico de dividendos da ação");
    }
  }

  async findUpcomingDividends(
    userId: string,
    month: number,
    year: number
  ): Promise<Dividend[]> {
    try {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      return await Dividend.findAll({
        where: {
          userId,
          paymentDate: {
            [Op.between]: [startDate, endDate],
          },
        },
        include: [
          {
            model: Stock,
            attributes: ["ticker", "type"],
          },
        ],
        order: [["paymentDate", "ASC"]],
      });
    } catch (error) {
      throw new Error("Erro ao buscar calendário de dividendos");
    }
  }

  async getDividendSummary(userId: string): Promise<DividendSummaryDTO> {
    try {
      const dividends = await this.findByUserId(userId);
      const totalReceived = dividends.reduce((sum, div) => sum + div.amount, 0);

      const monthlyDistributionRaw = (await Dividend.findAll({
        where: { userId },
        attributes: [
          [fn("date_trunc", "month", col("paymentDate")), "month"],
          [fn("sum", col("amount")), "amount"],
        ],
        group: [fn("date_trunc", "month", col("paymentDate"))],
        order: [[fn("date_trunc", "month", col("paymentDate")), "DESC"]],
        raw: true,
      })) as unknown as MonthlyDistributionResult[];

      const stockDistributionRaw = (await Dividend.findAll({
        where: { userId },
        attributes: [
          "stockId",
          [fn("sum", col("amount")), "amount"],
          [col("Stock.ticker"), "ticker"],
        ],
        include: [
          {
            model: Stock,
            attributes: [],
          },
        ],
        group: ["stockId", "Stock.ticker"],
        raw: true,
      })) as unknown as StockDistributionResult[];

      return {
        totalReceived,
        monthlyDistribution: monthlyDistributionRaw.map((d) => ({
          month: d.month,
          amount: parseFloat(d.amount),
        })),
        stockDistribution: stockDistributionRaw.map((d) => ({
          ticker: d.ticker,
          amount: parseFloat(d.amount),
        })),
      };
    } catch (error) {
      throw new Error("Erro ao gerar sumário de dividendos");
    }
  }

  async calculateMonthlyDividends(
    portfolioId: string,
    month: number,
    year: number
  ): Promise<number> {
    try {
      const result = await Dividend.sum("amount", {
        where: {
          portfolioId,
          paymentDate: {
            [Op.between]: [
              new Date(year, month - 1, 1),
              new Date(year, month, 0),
            ],
          },
        },
      });
      return result || 0;
    } catch (error) {
      throw new Error("Erro ao calcular dividendos mensais");
    }
  }
}
