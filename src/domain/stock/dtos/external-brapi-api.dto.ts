export interface BrapiHistoricalData {
  date: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

export interface BrapiStockQuote {
  symbol: string;
  shortName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketPreviousClose: number;
  regularMarketTime: string;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  historicalDataPrice: BrapiHistoricalData[];
}

export interface BrapiResponse {
  results: BrapiStockQuote[];
  requestedAt: string;
  took: string;
}
