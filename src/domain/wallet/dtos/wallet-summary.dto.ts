export interface WalletSummaryDTO {
  totalBalance: number;
  totalInvested: number;
  totalDividends: number;
  totalProfitability: number;
  stocks: {
    ticker: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    profitability: number;
  }[];
}
