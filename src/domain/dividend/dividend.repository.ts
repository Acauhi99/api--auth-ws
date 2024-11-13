import { Op, fn, col } from "sequelize";
import { Dividend } from "./dividend.model";
import { Stock } from "../stock/stock.model";
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
    return Dividend.findAll({
      where: { userId },
      include: [
        {
          model: Stock,
          attributes: ["ticker"],
        },
      ],
      order: [["paymentDate", "DESC"]],
    });
  }

  async getDividendSummary(userId: string): Promise<DividendSummaryDTO> {
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
      group: ["stockId", "ticker"],
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
  }

  async calculateMonthlyDividends(
    walletId: string,
    month: number,
    year: number
  ): Promise<number> {
    const result = await Dividend.sum("amount", {
      where: {
        walletId,
        paymentDate: {
          [Op.between]: [
            new Date(year, month - 1, 1),
            new Date(year, month, 0),
          ],
        },
      },
    });
    return result || 0;
  }
}
