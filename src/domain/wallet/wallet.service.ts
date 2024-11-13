import { WalletRepository } from "./wallet.repository";
import { TransactionRepository } from "../transaction";
import {
  DepositDTO,
  WithdrawDTO,
  ProfitabilityDTO,
  WalletSummaryDTO,
} from "./dtos";
import { TransactionType } from "../transaction";

export class WalletService {
  private walletRepository: WalletRepository;
  private transactionRepository: TransactionRepository;

  constructor() {
    this.walletRepository = new WalletRepository();
    this.transactionRepository = new TransactionRepository();
  }

  async getWalletSummary(userId: string): Promise<WalletSummaryDTO> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error(`Carteira não encontrada para o usuário ${userId}`);
    }

    return this.walletRepository.getWalletSummary(wallet.id);
  }

  async deposit(userId: string, data: DepositDTO): Promise<void> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error(`Carteira não encontrada para o usuário ${userId}`);
    }

    await this.walletRepository.update(wallet.id, {
      availableBalance: wallet.availableBalance + data.amount,
    });

    await this.transactionRepository.create({
      type: TransactionType.DEPOSIT,
      amount: data.amount,
      walletId: wallet.id,
      userId,
    });
  }

  async withdraw(userId: string, data: WithdrawDTO): Promise<void> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error(`Carteira não encontrada para o usuário ${userId}`);
    }

    if (wallet.availableBalance < data.amount) {
      throw new Error(
        `Saldo insuficiente para saque. Saldo atual: R$ ${wallet.availableBalance.toFixed(
          2
        )}, Valor solicitado: R$ ${data.amount.toFixed(2)}`
      );
    }

    await this.walletRepository.update(wallet.id, {
      availableBalance: wallet.availableBalance - data.amount,
    });

    await this.transactionRepository.create({
      type: TransactionType.WITHDRAWAL,
      amount: data.amount,
      walletId: wallet.id,
      userId,
    });
  }

  async getProfitability(
    userId: string,
    month: string,
    year: string
  ): Promise<ProfitabilityDTO> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new Error(`Carteira não encontrada para o usuário ${userId}`);
    }

    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const { transactions, appreciation } =
      await this.walletRepository.calculateProfitability(
        wallet.id,
        startDate,
        endDate
      );

    const dividends = transactions
      .filter((t) => t.type === TransactionType.DIVIDEND)
      .reduce((sum, t) => sum + t.amount, 0);

    const trades = transactions
      .filter((t) => t.type === TransactionType.SELL)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      month: `${month}/${year}`,
      total: dividends + trades + appreciation,
      dividends,
      trades,
      appreciation,
    };
  }
}
