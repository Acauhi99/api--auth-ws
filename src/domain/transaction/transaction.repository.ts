import { Op } from "sequelize";
import {
  Transaction,
  TransactionType,
  TransactionWithStock,
} from "./transaction.model";
import { CreateTransactionWithUserDTO, TransactionFilterDTO } from "./dtos";
import { Stock } from "../stock";
import { Transaction as SequelizeTransaction } from "sequelize";

export class TransactionRepository {
  async create(
    data: CreateTransactionWithUserDTO & { userId: string },
    transaction?: SequelizeTransaction
  ): Promise<Transaction> {
    try {
      return await Transaction.create(data, { transaction });
    } catch (error) {
      throw new Error(
        "Erro ao criar transação: dados inválidos ou incompletos"
      );
    }
  }

  async findById(transactionId: string): Promise<Transaction | null> {
    try {
      return await Transaction.findOne({
        where: { id: transactionId },
        include: [
          {
            model: Stock,
            attributes: ["ticker"],
          },
        ],
      });
    } catch (error) {
      throw new Error(`Erro ao buscar a transação com ID ${transactionId}`);
    }
  }

  async findByUserId(
    userId: string,
    filter: TransactionFilterDTO,
    transaction?: SequelizeTransaction
  ): Promise<TransactionWithStock[]> {
    try {
      const where: any = { userId };

      if (filter.type?.length) {
        where.type = { [Op.in]: filter.type };
      }

      if (filter.startDate && filter.endDate) {
        where.createdAt = {
          [Op.between]: [filter.startDate, filter.endDate],
        };
      }

      if (filter.stockId) {
        where.stockId = filter.stockId;
      }

      const transactions = await Transaction.findAll({
        where,
        include: [
          {
            model: Stock,
            attributes: ["ticker"],
          },
        ],
        order: [["createdAt", "DESC"]],
        transaction,
      });

      return transactions as TransactionWithStock[];
    } catch (error) {
      throw new Error(`Erro ao buscar transações do usuário ${userId}`);
    }
  }

  async findPortfolioTransactions(
    portfolioId: string,
    transaction?: SequelizeTransaction
  ): Promise<Transaction[]> {
    try {
      return await Transaction.findAll({
        where: { portfolioId },
        order: [["createdAt", "ASC"]],
        transaction,
      });
    } catch (error) {
      throw new Error(`Erro ao buscar transações da carteira ${portfolioId}`);
    }
  }

  async getStockTransactionBalance(
    portfolioId: string,
    stockId: string,
    transaction?: SequelizeTransaction
  ): Promise<number> {
    try {
      const transactions = await Transaction.findAll({
        where: {
          portfolioId,
          stockId,
          type: {
            [Op.in]: [TransactionType.BUY, TransactionType.SELL],
          },
        },
        transaction,
      });

      return transactions.reduce((balance, tx) => {
        return (
          balance +
          (tx.type === TransactionType.BUY ? tx.quantity! : -tx.quantity!)
        );
      }, 0);
    } catch (error) {
      throw new Error(
        `Erro ao calcular saldo de ações na carteira ${portfolioId} para o ativo ${stockId}`
      );
    }
  }

  async getPortfolioBalance(
    portfolioId: string,
    transaction?: SequelizeTransaction
  ): Promise<number> {
    try {
      const transactions = await Transaction.findAll({
        where: { portfolioId },
        transaction,
      });

      return transactions.reduce((balance, tx) => {
        switch (tx.type) {
          case TransactionType.DEPOSIT:
          case TransactionType.SELL:
          case TransactionType.DIVIDEND:
            return balance + tx.amount;
          case TransactionType.WITHDRAWAL:
          case TransactionType.BUY:
            return balance - tx.amount;
          default:
            return balance;
        }
      }, 0);
    } catch (error) {
      throw new Error(
        `Erro ao calcular saldo total da carteira ${portfolioId}`
      );
    }
  }
}
