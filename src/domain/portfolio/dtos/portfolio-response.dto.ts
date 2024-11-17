export interface Position {
  ticker: string;
  quantity: number;
  currentPrice: number | null;
  totalValue: number | null;
}

export interface Performance {
  totalInvested: string;
  totalGains: string;
  totalDividends: string;
  currentTotalValue: string;
  appreciation: string;
  profitability: string;
}

export interface StockInfo {
  symbol: string;
  currentPrice: number | null;
}
