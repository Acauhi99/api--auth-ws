import { Request, Response } from "express";
import { StockService } from "./stock.service";

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  getAvailableStocks = async (req: Request, res: Response): Promise<void> => {
    const search = req.query.search as string | undefined;
    const stocks = await this.stockService.getAvailableStocks(search);

    res.json(stocks);
  };

  getStockInfo = async (req: Request, res: Response): Promise<void> => {
    const ticker = req.params.ticker as string;
    const stock = await this.stockService.getStockInfo(ticker);

    res.json(stock);
  };
}
