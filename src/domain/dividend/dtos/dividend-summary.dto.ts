export interface DividendSummaryDTO {
  totalReceived: number;
  monthlyDistribution: {
    month: string;
    amount: number;
  }[];
  stockDistribution: {
    ticker: string;
    amount: number;
  }[];
}
