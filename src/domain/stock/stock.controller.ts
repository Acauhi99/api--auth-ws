import { Request, Response } from "express";
import { StockService } from "./stock.service";
import { StockQuoteDTO } from "./dtos";

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  getAvailableStocks = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const search = (req.query.search as string) || "BR";
      const availableStocks = await this.stockService.fetchAvailableStocks(
        search
      );
      return res.status(200).json(availableStocks);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar ações disponíveis",
        error: (error as Error).message,
      });
    }
  };

  getStockQuote = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { ticker } = req.params;

      if (!ticker) {
        return res.status(400).json({
          message: "Ticker é obrigatório",
        });
      }

      const quote: StockQuoteDTO | null = await this.stockService.getStockQuote(
        ticker
      );
      if (!quote) {
        return res.status(404).json({
          message: "Cotação não encontrada",
        });
      }

      return res.status(200).json(quote);
    } catch (error) {
      return res.status(500).json({
        message: "Erro ao buscar cotação",
        error: (error as Error).message,
      });
    }
  };
}
