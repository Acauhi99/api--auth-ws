import { TransactionType } from "../transaction.model";

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  quantity?: number;
  ticker?: string;
  portfolioId: string;
  price?: number;
}

export interface CreateTransactionWithUserDTO extends CreateTransactionDTO {
  userId: string;
  date: Date;
}
