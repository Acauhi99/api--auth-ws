export interface CreateDividendDTO {
  stockId: string;
  walletId: string;
  amount: number;
  paymentDate: Date;
  declaredDate: Date;
}
