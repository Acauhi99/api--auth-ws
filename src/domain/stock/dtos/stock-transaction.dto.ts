export interface StockTransactionDTO {
  stockId: string;
  quantity: number;
  price: number;
  type: "BUY" | "SELL";
}
