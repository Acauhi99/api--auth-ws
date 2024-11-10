import { Request, Response } from "express";
import { StockService } from "../domain/stock";
import {
  CreateStockDTO,
  StockFilterDTO,
  StockQuoteDTO,
} from "../domain/stock/dtos";

export class StockController {
  private stockService: StockService;

  constructor() {
    this.stockService = new StockService();
  }

  getAllStocks = async (req: Request, res: Response): Promise<Response> => {
    try {
      const filters: StockFilterDTO = req.query;
      const stocks = await this.stockService.getAllStocks(filters);
      return res.status(200).json(stocks);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  createStock = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stockData: CreateStockDTO = req.body;

      if (!this.isValidCreateStockDTO(stockData)) {
        return res.status(400).json({
          message:
            "Dados incompletos. type, ticker e currentPrice são obrigatórios",
        });
      }

      const newStock = await this.stockService.createStock(stockData);
      return res.status(201).json(newStock);
    } catch (error) {
      if (error instanceof Error && error.message.includes("unique")) {
        return res.status(400).json({ message: "Ticker já existente" });
      }
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getStockById = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { id } = req.params;
      const stock = await this.stockService.getStockById(id);

      if (!stock) {
        return res.status(404).json({ message: "Ativo não encontrado" });
      }

      return res.status(200).json(stock);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getStockQuote = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { ticker } = req.params;
      const quote: StockQuoteDTO = await this.stockService.getStockQuote(
        ticker
      );

      if (!quote) {
        return res.status(404).json({ message: "Cotação não encontrada" });
      }

      return res.status(200).json(quote);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  private isValidCreateStockDTO(
    data: Partial<CreateStockDTO>
  ): data is CreateStockDTO {
    return !!(
      data.type &&
      data.ticker &&
      typeof data.currentPrice === "number"
    );
  }
}
