import { Request, Response } from "express";
import { StockService } from "../domain/stock";
import {
  AvailableStockDTO,
  CreateStockDTO,
  StockFilterDTO,
  StockQuoteDTO,
  StockQuotesDTO,
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

  getAvailableStocks = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const search: string = "BR";
      const availableStocks: AvailableStockDTO =
        await this.stockService.fetchAvailableStocks(search);

      return res.status(200).json(availableStocks);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getQuotes = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { tickers } = req.params;
      const query = req.query;

      const tickersArray = tickers.split(",").map((ticker) => ticker.trim());

      const options = {
        range: query.range as string,
        interval: query.interval as string,
        fundamental: query.fundamental === "true",
        dividends: query.dividends === "true",
        modules: query.modules
          ? (query.modules as string).split(",")
          : undefined,
      };

      const quotes: StockQuotesDTO = await this.stockService.getQuotes(
        tickersArray,
        options
      );

      return res.status(200).json(quotes);
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
