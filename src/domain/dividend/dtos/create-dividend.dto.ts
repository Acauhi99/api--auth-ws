export interface CreateDividendDTO {
  stockId: string;
  portfolioId: string;
  amount: number;
  paymentDate: Date;
  declaredDate: Date;
}
