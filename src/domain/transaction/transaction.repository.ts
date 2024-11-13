import { Op } from "sequelize";
import {
  Transaction,
  TransactionType,
  TransactionWithStock,
} from "./transaction.model";
import { CreateTransactionDTO, TransactionFilterDTO } from "./dtos";
import { Stock } from "../stock";

export class TransactionRepository {
  async create(
    data: CreateTransactionDTO & { userId: string }
  ): Promise<Transaction> {
    try {
      return await Transaction.create(data);
    } catch (error) {
      throw new Error(
        `Erro ao criar transação: dados inválidos ou incompletos`
      );
    }
  }

  async findByUserId(
    userId: string,
    filter: TransactionFilterDTO
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
      });

      return transactions as TransactionWithStock[];
    } catch (error) {
      throw new Error(`Erro ao buscar transações do usuário ${userId}`);
    }
  }

  async findWalletTransactions(walletId: string): Promise<Transaction[]> {
    try {
      return await Transaction.findAll({
        where: { walletId },
        order: [["createdAt", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Erro ao buscar transações da carteira ${walletId}`);
    }
  }

  async getStockTransactionBalance(
    walletId: string,
    stockId: string
  ): Promise<number> {
    try {
      const transactions = await Transaction.findAll({
        where: {
          walletId,
          stockId,
          type: {
            [Op.in]: [TransactionType.BUY, TransactionType.SELL],
          },
        },
      });

      return transactions.reduce((balance, tx) => {
        return (
          balance +
          (tx.type === TransactionType.BUY ? tx.quantity! : -tx.quantity!)
        );
      }, 0);
    } catch (error) {
      throw new Error(
        `Erro ao calcular saldo de ações na carteira ${walletId} para o ativo ${stockId}`
      );
    }
  }

  async getWalletBalance(walletId: string): Promise<number> {
    try {
      const transactions = await Transaction.findAll({
        where: { walletId },
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
      throw new Error(`Erro ao calcular saldo total da carteira ${walletId}`);
    }
  }
}
