import axios from "axios";
import { BRAPI_TOKEN, BRAPI_URL } from "../../config";
import { StockQuoteDTO, StockQuoteResponse } from "./dtos";
import { StockRepository } from "./stock.repository";
import {
  StockAttributes,
  StockCreationAttributes,
  StockType,
} from "./stock.model";
import { Transaction as SequelizeTransaction } from "sequelize";

export class StockService {
  private stockRepository: StockRepository;

  constructor() {
    this.stockRepository = new StockRepository();
  }

  async getCurrentPrice(ticker: string): Promise<number | null> {
    try {
      const response = await axios.get<StockQuoteResponse>(
        `${BRAPI_URL}/api/quote/${ticker}`,
        { params: { token: BRAPI_TOKEN } }
      );

      if (!response.data?.results?.[0]) {
        throw new Error(`No data found for ticker: ${ticker}`);
      }

      const currentPrice = response.data.results[0].regularMarketPrice;
      await this.stockRepository.updateByTicker(ticker, currentPrice);
      return currentPrice;
    } catch (error) {
      console.error(
        `Error fetching stock price for ${ticker}:`,
        (error as Error).message
      );
      return null;
    }
  }

  async createOrUpdateStock(
    stock: Partial<StockAttributes>,
    transaction?: SequelizeTransaction
  ): Promise<StockAttributes> {
    if (!stock.ticker) {
      throw new Error("Ticker é obrigatório para criar ou atualizar uma ação.");
    }

    const stockData: StockCreationAttributes = {
      ticker: stock.ticker,
      type: stock.type || StockType.STOCK,
      currentPrice: stock.currentPrice || 0,
    };

    const updatedStock = await this.stockRepository.createOrUpdateStock(
      stockData,
      transaction
    );
    return updatedStock;
  }

  async getStockQuote(ticker: string): Promise<StockQuoteDTO | null> {
    try {
      const stock = await this.stockRepository.findByTicker(ticker);
      if (!stock) {
        throw new Error(`Ação com ticker ${ticker} não encontrada.`);
      }

      const currentPrice = await this.getCurrentPrice(ticker);
      if (currentPrice === null) {
        throw new Error(`Não foi possível obter o preço atual para ${ticker}.`);
      }

      const shortName = stock.ticker;

      const stockQuote: StockQuoteDTO = {
        ticker: stock.ticker,
        type: stock.type,
        currentPrice: Number(currentPrice),
        shortName,
        lastUpdated: new Date(),
      };

      return stockQuote;
    } catch (error) {
      console.error(`Erro em getStockQuote: ${(error as Error).message}`);
      throw error;
    }
  }

  async fetchAvailableStocks(search: string): Promise<any> {
    try {
      const response = await axios.get<{ stocks: string[] }>(
        `${BRAPI_URL}/api/available`,
        { params: { token: BRAPI_TOKEN, search } }
      );

      if (!response.data?.stocks) {
        throw new Error("Invalid response format from BRAPI");
      }

      return {
        stocks: response.data.stocks.map((ticker) => ({
          symbol: ticker,
          shortName: ticker,
          type: ticker.endsWith("11") ? "REIT" : "STOCK",
        })),
      };
    } catch (error) {
      throw new Error(
        `Error fetching available stocks: ${(error as Error).message}`
      );
    }
  }
}
