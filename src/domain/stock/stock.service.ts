import axios from "axios";
import { StockRepository } from "./stock.repository";
import {
  CreateStockDTO,
  StockFilterDTO,
  StockQuoteDTO,
  AvailableStockDTO,
  StockQuotesDTO,
} from "./dtos";
import { BRAPI_TOKEN, BRAPI_URL } from "../../config";
import { Stock } from "./stock.model";

interface QuoteResponse {
  results: Array<{
    symbol: string;
    regularMarketPrice: number;
  }>;
}

interface StockQuoteResponse {
  results: Array<{
    symbol: string;
    currency: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketTime: number;
  }>;
}

export class StockService {
  private stockRepository: StockRepository;

  constructor() {
    this.stockRepository = new StockRepository();
  }

  async createStock(data: CreateStockDTO): Promise<Stock> {
    this.validateStock(data);
    return this.stockRepository.create(data);
  }

  async getAllStocks(filters: StockFilterDTO): Promise<Stock[]> {
    return this.stockRepository.findAll(filters);
  }

  async getStockById(id: string): Promise<Stock> {
    return this.stockRepository.findById(id);
  }

  async getStockQuote(ticker: string): Promise<StockQuoteDTO> {
    try {
      const response = await axios.get<StockQuoteResponse>(
        `${BRAPI_URL}/quote/${ticker}`,
        {
          params: { token: BRAPI_TOKEN },
        }
      );

      const quoteData = response.data.results[0];

      const quote: StockQuoteDTO = {
        symbol: quoteData.symbol,
        currency: quoteData.currency,
        currentPrice: quoteData.regularMarketPrice,
        change: quoteData.regularMarketChange,
        changePercent: quoteData.regularMarketChangePercent,
        updatedAt: new Date(quoteData.regularMarketTime * 1000),
      };

      await this.stockRepository.updateByTicker(ticker, {
        currentPrice: quote.currentPrice,
      });

      return quote;
    } catch (error) {
      throw new Error(
        `Erro ao obter cotação da API externa: ${(error as Error).message}`
      );
    }
  }

  async getQuotes(
    tickers: string[],
    options: {
      range?: string;
      interval?: string;
      fundamental?: boolean;
      dividends?: boolean;
      modules?: string[];
    }
  ): Promise<StockQuotesDTO> {
    try {
      const params: any = {
        token: BRAPI_TOKEN,
      };

      if (options.range) params.range = options.range;
      if (options.interval) params.interval = options.interval;
      if (options.fundamental !== undefined)
        params.fundamental = options.fundamental;
      if (options.dividends !== undefined) params.dividends = options.dividends;
      if (options.modules) params.modules = options.modules.join(",");

      const response = await axios.get(
        `${BRAPI_URL}/quote/${tickers.join(",")}`,
        {
          params,
        }
      );

      return response.data as StockQuotesDTO;
    } catch (error) {
      throw new Error(
        `Erro ao obter cotações múltiplas: ${(error as Error).message}`
      );
    }
  }

  async fetchAvailableStocks(search: string): Promise<AvailableStockDTO> {
    try {
      const params: any = { token: BRAPI_TOKEN };

      if (search) {
        params.search = search;
      }

      const response = await axios.get(`${BRAPI_URL}/api/available`, {
        params,
      });

      return response.data as AvailableStockDTO;
    } catch (error) {
      throw new Error(
        `Erro ao buscar ações disponíveis: ${(error as Error).message}`
      );
    }
  }

  async syncStockPrices(): Promise<void> {
    try {
      const stocks = await this.stockRepository.findAll({});
      const tickers = stocks.map((stock) => stock.ticker);

      const response = await axios.get<QuoteResponse>(
        `${BRAPI_URL}/api/quote/${tickers.join(",")}`,
        {
          params: { token: BRAPI_TOKEN },
        }
      );

      const updates = response.data.results.map((quote) => ({
        ticker: quote.symbol,
        price: quote.regularMarketPrice,
      }));

      await this.stockRepository.bulkUpdatePrices(updates);
    } catch (error) {
      throw new Error(
        `Erro ao sincronizar preços das ações: ${(error as Error).message}`
      );
    }
  }

  private validateStock(data: CreateStockDTO): void {
    if (!data.ticker || !data.type) {
      throw new Error(
        "Dados da ação inválidos: ticker e tipo são obrigatórios"
      );
    }
    if (data.currentPrice !== undefined && data.currentPrice <= 0) {
      throw new Error("Preço atual da ação deve ser maior que zero");
    }
  }
}
