export interface StockQuotesDTO {
  results: Array<{
    symbol: string;
    currency: string;
    shortName: string;
    longName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
    regularMarketVolume: number;
    marketCap: number | null;
    priceEarnings: number | null;
    earningsPerShare: number | null;
    twoHundredDayAverage: number;
    twoHundredDayAverageChange: number;
    twoHundredDayAverageChangePercent: number;
    fiftyTwoWeekLow: number;
    fiftyTwoWeekHigh: number;
    historicalDataPrice: HistoricalPrice[];
    dividendsData: DividendsData;
    updatedAt: Date;
  }>;
}

interface HistoricalPrice {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  adjustedClose: number;
}

interface DividendsData {
  cashDividends: CashDividend[];
  stockDividends: StockDividend[];
}

interface CashDividend {
  paymentDate: Date;
  rate: number;
  relatedTo: string;
  isinCode: string;
}

interface StockDividend {
  factor: number;
  completeFactor: string;
  isinCode: string;
}
