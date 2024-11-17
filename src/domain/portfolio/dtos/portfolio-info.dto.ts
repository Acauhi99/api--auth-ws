export interface PortfolioOverview {
  balance: number;
  totalInvested: number;
  totalValue: number;
  totalDividends: number;
}

export interface MonthlyPerformance {
  month: string;
  performance: number;
  dividends: number;
}
