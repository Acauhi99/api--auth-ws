export interface StockQuoteDTO {
  symbol: string;
  currency: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  updatedAt: Date;
}
