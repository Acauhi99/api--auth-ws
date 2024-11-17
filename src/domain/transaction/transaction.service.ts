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

    try {
      const portfolio = await this.portfolioRepository.findById(
        transactionData.portfolioId,
        t
      );

      if (!portfolio) {
        throw new Error("Portfólio não encontrado");
      }

      if (portfolio.userId !== userId) {
        throw new Error("O portfólio não pertence ao usuário");
      }

      // Mapeamento de handlers por tipo de transação
      const handlers: Record<TransactionType, () => Promise<void>> = {
        [TransactionType.BUY]: async () => {
          await this.validateBuyTransaction(
            portfolio.balance,
            transactionData.amount
          );

          await this.portfolioRepository.updateBalance(
            portfolio.id,
            portfolio.balance - transactionData.amount,
            t
          );
        },
        [TransactionType.SELL]: async () => {
          const currentPosition =
            await this.transactionRepository.getCurrentPosition(
              userId,
              transactionData.ticker!,
              t
            );

          if (currentPosition < transactionData.quantity!) {
            throw new Error("Quantidade insuficiente de ações");
          }

          await this.portfolioRepository.updateBalance(
            portfolio.id,
            portfolio.balance + transactionData.amount,
            t
          );
        },
        [TransactionType.DEPOSIT]: async () => {
          await this.portfolioRepository.updateBalance(
            portfolio.id,
            portfolio.balance + transactionData.amount,
            t
          );
        },
        [TransactionType.WITHDRAWAL]: async () => {
          await this.validateWithdrawal(
            portfolio.balance,
            transactionData.amount
          );

          await this.portfolioRepository.updateBalance(
            portfolio.id,
            portfolio.balance - transactionData.amount,
            t
          );
        },
        [TransactionType.DIVIDEND]: async () => {
          await this.portfolioRepository.updateBalance(
            portfolio.id,
            portfolio.balance + transactionData.amount,
            t
          );
        },
      };

      const handler = handlers[transactionData.type];

      if (!handler) {
        throw new Error("Tipo de transação inválido");
      }

      await handler();

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
    } catch (error) {
      await t.rollback();
      throw error;
    }
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
