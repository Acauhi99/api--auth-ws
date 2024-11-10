export interface TransactionHistoryDTO {
  date: Date;
  type: string;
  stockTicker?: string;
  quantity?: number;
  price: number;
  total: number;
  balance: number;
}
