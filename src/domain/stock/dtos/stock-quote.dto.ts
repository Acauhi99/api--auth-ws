export interface StockQuoteDTO {
  ticker: string;
  type: string;
  currentPrice: number;
  shortName: string;
  lastUpdated: Date;
}
