import { TransactionType } from "../transaction.model";

export interface CreateTransactionDTO {
  type: TransactionType;
  amount: number;
  quantity?: number;
  stockId?: string;
  portfolioId: string;
}

export interface CreateTransactionWithUserDTO extends CreateTransactionDTO {
  userId: string;
}

export interface CreateTransactionWithUserAndPriceDTO
  extends CreateTransactionWithUserDTO {
  priceAtTransaction: number;
}
