import { TransactionType } from "../transaction.model";

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  quantity?: number;
  stockId?: string;
  walletId: string;
}
