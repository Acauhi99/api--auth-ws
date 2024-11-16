import { StockType } from "../stock.model";

export interface StockQuoteDTO {
  symbol: string;
  shortName: string;
  currentPrice: number;
  previousClose: number;
  priceChange: number;
  priceChangePercent: number;
  updatedAt: Date;
  historicalData: HistoricalDataDTO[];
  dividends?: DividendDTO[];
}

export interface StockQuoteResponse {
  stocks: Array<{
    symbol: string;
    shortName: string;
    type: StockType;
    currentPrice: number;
    priceChange: number;
    priceChangePercent: number;
    updatedAt: Date;
  }>;
}

export interface AvailableStocksResponse {
  stocks: Array<{
    symbol: string;
    shortName: string;
    type: StockType;
  }>;
}

interface HistoricalDataDTO {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface DividendDTO {
  paymentDate: Date;
  rate: number;
  type: string;
  relatedTo?: string;
}
