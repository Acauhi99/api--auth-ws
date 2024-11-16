import { DividendRepository } from "./dividend.repository";
import { PortfolioRepository } from "../portfolio";
import { TransactionRepository } from "../transaction";
import { CreateDividendDTO, DividendSummaryDTO } from "./dtos";
import { TransactionType } from "../transaction";
import { Dividend } from "./dividend.model";

export class DividendService {
  private dividendRepository: DividendRepository;
  private portfolioRepository: PortfolioRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.dividendRepository = new DividendRepository();
    this.portfolioRepository = new PortfolioRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createDividend(data: CreateDividendDTO): Promise<Dividend> {
    await this.validateDividend(data);
    const portfolio = await this.portfolioRepository.findById(data.portfolioId);

    if (!portfolio) {
      throw new Error("Carteira não encontrada");
    }

    const dividend = await this.dividendRepository.create({
      ...data,
      userId: portfolio.userId,
    });

    portfolio.balance += data.amount;
    await this.portfolioRepository.updateBalance(
      portfolio.id,
      portfolio.balance
    );

    await this.transactionRepository.create({
      type: TransactionType.DIVIDEND,
      amount: data.amount,
      userId: portfolio.userId,
      portfolioId: portfolio.id,
      stockId: data.stockId,
    });

    return dividend;
  }

  async getDividendsByUserId(userId: string): Promise<Dividend[]> {
    return this.dividendRepository.findByUserId(userId);
  }

  async getDividendSummary(userId: string): Promise<DividendSummaryDTO> {
    return this.dividendRepository.getDividendSummary(userId);
  }

  async getDividendCalendar(
    userId: string,
    month: number,
    year: number
  ): Promise<Dividend[]> {
    return this.dividendRepository.findUpcomingDividends(userId, month, year);
  }

  async getStockDividendHistory(
    userId: string,
    stockId: string
  ): Promise<Dividend[]> {
    return this.dividendRepository.findByStockId(userId, stockId);
  }

  async calculateMonthlyDividends(
    portfolioId: string,
    month: number,
    year: number
  ): Promise<number> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);
    if (!portfolio) throw new Error("Carteira não encontrada");

    return this.dividendRepository.calculateMonthlyDividends(
      portfolioId,
      month,
      year
    );
  }

  private async validateDividend(data: CreateDividendDTO): Promise<void> {
    if (data.amount <= 0) {
      throw new Error("O valor do dividendo deve ser maior que zero");
    }

    if (data.paymentDate < data.declaredDate) {
      throw new Error(
        "A data de pagamento não pode ser anterior à data de declaração"
      );
    }

    const portfolio = await this.portfolioRepository.findById(data.portfolioId);
    if (!portfolio) {
      throw new Error("Carteira não encontrada");
    }

    const portfolioStock = await this.portfolioRepository.findStockInPortfolio(
      data.portfolioId,
      data.stockId
    );
    if (!portfolioStock) {
      throw new Error("Ação não encontrada na carteira");
    }
  }
}
