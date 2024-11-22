import axios from "axios";
import { BRAPI_TOKEN, BRAPI_URL } from "../../config";
import { StockRepository } from "./stock.repository";
import { StockCreationAttributes, StockType } from "./stock.model";
import {
  BrapiHistoricalData,
  BrapiResponse,
  BrapiStockQuote,
  AvailableStocksResponse,
  DividendDTO,
  StockQuoteDTO,
} from "./dtos";

export class StockService {
  private stockRepository: StockRepository;

  constructor() {
    this.stockRepository = new StockRepository();
  }

  async getAvailableStocks(search?: string): Promise<AvailableStocksResponse> {
    try {
      const stocks = await this.fetchBrapiAvailableStocks(search);
      const brazilianStocks = this.filterBrazilianTickers(stocks);
      await this.syncStocksWithDatabase(brazilianStocks);

      return {
        stocks: brazilianStocks.map((stock) => ({
          symbol: stock.ticker,
          shortName: stock.ticker,
          type: stock.type,
        })),
      };
    } catch (error) {
      throw new Error(
        `Erro ao buscar ativos disponíveis: ${(error as Error).message}`
      );
    }
  }

  async getStockInfo(ticker: string): Promise<StockQuoteDTO> {
    try {
      if (!ticker) throw new Error("Ticker é obrigatório");

      const formattedTicker = ticker.toUpperCase().trim();
      const stockData = await this.fetchBrapiStockQuote(formattedTicker);
      const mockDividends = this.generateMockDividends(formattedTicker);

      const stockQuote = this.mapToStockQuoteDTO(stockData, mockDividends);
      await this.stockRepository.updateByTicker(
        formattedTicker,
        stockQuote.currentPrice
      );

      return stockQuote;
    } catch (error) {
      console.error("Erro ao buscar informações do ativo:", error);
      throw error;
    }
  }

  private async fetchBrapiAvailableStocks(search?: string): Promise<string[]> {
    const response = await axios.get<{ stocks: string[] }>(
      `${BRAPI_URL}/api/available`,
      { params: { token: BRAPI_TOKEN, search } }
    );

    if (!response.data?.stocks) {
      throw new Error("Formato de resposta inválido da BRAPI");
    }

    return response.data.stocks;
  }

  private async fetchBrapiStockQuote(ticker: string): Promise<BrapiStockQuote> {
    try {
      const response = await axios.get<BrapiResponse>(
        `${BRAPI_URL}/api/quote/${ticker}`,
        {
          params: {
            token: BRAPI_TOKEN,
            range: "1mo",
            interval: "1d",
            fundamental: true,
          },
          validateStatus: (status) => status === 200,
        }
      );

      if (!response.data?.results?.[0]) {
        throw new Error(`Nenhum dado encontrado para o ticker: ${ticker}`);
      }

      return response.data.results[0];
    } catch (apiError: any) {
      const mensagem = apiError.response?.data?.message || apiError.message;
      const codigo = apiError.response?.status;
      throw new Error(
        `Erro na API BRAPI (${codigo}): ${mensagem} para o ticker ${ticker}`
      );
    }
  }

  private async syncStocksWithDatabase(
    stocks: StockCreationAttributes[]
  ): Promise<void> {
    const existingStocks = await this.stockRepository.findByTickers(
      stocks.map((stock) => stock.ticker)
    );

    const existingTickers = new Set(
      existingStocks.map((stock) => stock.ticker)
    );
    const missingStocks = stocks.filter(
      (stock) => !existingTickers.has(stock.ticker)
    );

    if (missingStocks.length > 0) {
      await this.stockRepository.bulkCreate(missingStocks);
    }
  }

  private mapToStockQuoteDTO(
    stockData: BrapiStockQuote,
    dividends: DividendDTO[]
  ): StockQuoteDTO {
    return {
      symbol: stockData.symbol,
      shortName: stockData.shortName,
      currentPrice: stockData.regularMarketPrice,
      previousClose: stockData.regularMarketPreviousClose,
      priceChange: stockData.regularMarketChange,
      priceChangePercent: stockData.regularMarketChangePercent,
      updatedAt: new Date(stockData.regularMarketTime),
      historicalData: (stockData.historicalDataPrice || []).map(
        (item: BrapiHistoricalData) => ({
          date: new Date(item.date * 1000),
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
          volume: item.volume,
        })
      ),
      dividends,
    };
  }

  private filterBrazilianTickers(tickers: string[]): StockCreationAttributes[] {
    const brStockPattern = /^[A-Z]{4}[3-8]$/;
    const fiiFundPattern = /^[A-Z]{4}11$/;

    return tickers
      .filter(
        (ticker) => brStockPattern.test(ticker) || fiiFundPattern.test(ticker)
      )
      .map((ticker) => ({
        ticker,
        type: ticker.endsWith("11") ? StockType.REIT : StockType.STOCK,
        currentPrice: 0,
      }));
  }

  private generateMockDividends(ticker: string): DividendDTO[] {
    const now = new Date();
    const mockDividends: DividendDTO[] = [];

    for (let i = 0; i < 4; i++) {
      const paymentDate = new Date(now);
      paymentDate.setMonth(now.getMonth() - i * 3);

      mockDividends.push({
        paymentDate,
        rate: Number((Math.random() * 1.5 + 0.5).toFixed(2)),
        type: "DIVIDENDO",
        relatedTo: `${Math.floor(
          (12 - i * 3) / 3
        )}º Trimestre/${now.getFullYear()}`,
      });
    }

    return mockDividends;
  }
}
