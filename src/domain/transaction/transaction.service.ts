import { TransactionRepository } from "./transaction.repository";
import { WalletRepository } from "../wallet";
import { StockRepository } from "../stock";
import { CreateTransactionDTO, TransactionFilterDTO } from "./dtos";
import { Transaction, TransactionType } from "./transaction.model";

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private walletRepository: WalletRepository;
  private stockRepository: StockRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.walletRepository = new WalletRepository();
    this.stockRepository = new StockRepository();
  }

  async createTransaction(
    userId: string,
    data: CreateTransactionDTO
  ): Promise<Transaction> {
    await this.validateTransaction(data);

    const transaction = await this.transactionRepository.create({
      ...data,
      userId,
    });

    await this.updateWalletBalance(data);

    return transaction;
  }

  private async validateTransaction(data: CreateTransactionDTO): Promise<void> {
    switch (data.type) {
      case TransactionType.BUY:
        await this.validateBuyTransaction(data);
        break;
      case TransactionType.SELL:
        await this.validateSellTransaction(data);
        break;
      case TransactionType.WITHDRAWAL:
        await this.validateWithdrawal(data);
        break;
    }
  }

  private async validateBuyTransaction(
    data: CreateTransactionDTO
  ): Promise<void> {
    const walletBalance = await this.transactionRepository.getWalletBalance(
      data.walletId
    );

    if (walletBalance < data.amount) {
      throw new Error(
        `Saldo insuficiente na carteira para realizar a compra. Saldo atual: R$ ${walletBalance.toFixed(
          2
        )}, Valor necessário: R$ ${data.amount.toFixed(2)}`
      );
    }

    const stock = await this.stockRepository.findById(data.stockId!);
    if (!stock) {
      throw new Error(`Ação não encontrada no sistema (ID: ${data.stockId})`);
    }
  }

  private async validateSellTransaction(
    data: CreateTransactionDTO
  ): Promise<void> {
    const stockBalance =
      await this.transactionRepository.getStockTransactionBalance(
        data.walletId,
        data.stockId!
      );

    if (stockBalance < data.quantity!) {
      throw new Error(
        `Quantidade insuficiente de ações para venda. Quantidade disponível: ${stockBalance}, Quantidade solicitada: ${data.quantity}`
      );
    }
  }

  private async validateWithdrawal(data: CreateTransactionDTO): Promise<void> {
    const walletBalance = await this.transactionRepository.getWalletBalance(
      data.walletId
    );

    if (walletBalance < data.amount) {
      throw new Error(
        `Saldo insuficiente para realizar o saque. Saldo atual: R$ ${walletBalance.toFixed(
          2
        )}, Valor do saque: R$ ${data.amount.toFixed(2)}`
      );
    }
  }

  private async updateWalletBalance(data: CreateTransactionDTO): Promise<void> {
    const wallet = await this.walletRepository.findById(data.walletId);
    let newBalance = wallet.availableBalance;

    switch (data.type) {
      case TransactionType.DEPOSIT:
      case TransactionType.SELL:
      case TransactionType.DIVIDEND:
        newBalance += data.amount;
        break;
      case TransactionType.WITHDRAWAL:
      case TransactionType.BUY:
        newBalance -= data.amount;
        break;
    }

    await this.walletRepository.update(data.walletId, {
      availableBalance: newBalance,
    });
  }

  async getTransactionsByUserId(userId: string, filter: TransactionFilterDTO) {
    return this.transactionRepository.findByUserId(userId, filter);
  }

  async getDetailedHistory(userId: string, filter: TransactionFilterDTO) {
    const transactions = await this.getTransactionsByUserId(userId, filter);
    let balance = 0;

    return transactions.map((tx) => {
      balance += this.calculateBalanceImpact(tx);

      return {
        date: tx.createdAt,
        type: tx.type,
        stockTicker: tx.stock?.ticker,
        quantity: tx.quantity,
        price: tx.amount / (tx.quantity || 1),
        total: tx.amount,
        balance,
      };
    });
  }

  private calculateBalanceImpact(transaction: Transaction): number {
    switch (transaction.type) {
      case TransactionType.DEPOSIT:
      case TransactionType.SELL:
      case TransactionType.DIVIDEND:
        return transaction.amount;
      case TransactionType.WITHDRAWAL:
      case TransactionType.BUY:
        return -transaction.amount;
      default:
        return 0;
    }
  }
}
