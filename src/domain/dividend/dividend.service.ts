import { DividendRepository } from "./dividend.repository";
import { WalletRepository } from "../wallet";
import { TransactionRepository } from "../transaction/";
import { CreateDividendDTO, DividendSummaryDTO } from "./dtos";
import { TransactionType } from "../transaction";
import { Dividend } from "./dividend.model";

export class DividendService {
  private dividendRepository: DividendRepository;
  private walletRepository: WalletRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.dividendRepository = new DividendRepository();
    this.walletRepository = new WalletRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async createDividend(data: CreateDividendDTO): Promise<Dividend> {
    await this.validateDividend(data);

    const wallet = await this.walletRepository.findById(data.walletId);

    const dividend = await this.dividendRepository.create({
      ...data,
      userId: wallet.userId,
    });

    await this.walletRepository.update(data.walletId, {
      availableBalance: wallet.availableBalance + data.amount,
    });

    await this.transactionRepository.create({
      type: TransactionType.DIVIDEND,
      amount: data.amount,
      walletId: data.walletId,
      stockId: data.stockId,
      userId: wallet.userId,
    });

    return dividend;
  }

  async getDividendsByUserId(userId: string): Promise<DividendSummaryDTO> {
    return this.dividendRepository.getDividendSummary(userId);
  }

  async calculateMonthlyDividends(
    walletId: string,
    month: number,
    year: number
  ): Promise<number> {
    return this.dividendRepository.calculateMonthlyDividends(
      walletId,
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

    if (data.paymentDate < new Date()) {
      throw new Error("A data de pagamento não pode estar no passado");
    }
  }
}
