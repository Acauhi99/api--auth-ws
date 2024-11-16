import { TransactionType } from "../../transaction";

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  userId: string;
  portfolioId: string;
  stockId?: string;
  quantity?: number;
  priceAtTransaction?: number;
}
