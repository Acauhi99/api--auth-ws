import { Transaction, TransactionType } from "./transaction.model";
import { TransactionRepository } from "./transaction.repository";
import { PortfolioRepository } from "../portfolio/portfolio.repository";
import { CreateTransactionDTO } from "./dtos";
import { sequelize } from "../../sequelize";

export class TransactionService {
  private transactionRepository: TransactionRepository;
  private portfolioRepository: PortfolioRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
    this.portfolioRepository = new PortfolioRepository();
  }

  async createTransaction(
    userId: string,
    transactionData: CreateTransactionDTO
  ): Promise<Transaction> {
    const t = await sequelize.transaction();

    const portfolio = await this.portfolioRepository.findById(
      transactionData.portfolioId,
      t
    );

    if (!portfolio) {
      await t.rollback();
      throw new Error("Portfólio não encontrado");
    }

    if (portfolio.userId !== userId) {
      await t.rollback();
      throw new Error("O portfólio não pertence ao usuário");
    }

    if (transactionData.type === TransactionType.BUY) {
      await this.validateBuyTransaction(
        portfolio.balance,
        transactionData.amount
      );

      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance - transactionData.amount,
        t
      );
    } else if (transactionData.type === TransactionType.SELL) {
      const currentPosition =
        await this.transactionRepository.getCurrentPosition(
          userId,
          transactionData.ticker!,
          t
        );

      if (currentPosition < transactionData.quantity!) {
        await t.rollback();
        throw new Error("Quantidade insuficiente de ações");
      }

      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance + transactionData.amount,
        t
      );
    } else if (transactionData.type === TransactionType.DEPOSIT) {
      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance + transactionData.amount,
        t
      );
    } else if (transactionData.type === TransactionType.WITHDRAWAL) {
      await this.validateWithdrawal(portfolio.balance, transactionData.amount);
      await this.portfolioRepository.updateBalance(
        portfolio.id,
        portfolio.balance - transactionData.amount,
        t
      );
    }

    const transaction = await this.transactionRepository.create(
      {
        ...transactionData,
        userId,
        date: new Date(),
      },
      t
    );

    await t.commit();
    return transaction;
  }

  async getTransactionHistory(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.findByUserId(userId);
  }

  private async validateBuyTransaction(
    balance: number,
    amount: number
  ): Promise<void> {
    if (balance < amount) throw new Error("Saldo insuficiente");
  }

  private async validateWithdrawal(
    balance: number,
    amount: number
  ): Promise<void> {
    if (balance < amount) throw new Error("Saldo insuficiente");
  }
}
