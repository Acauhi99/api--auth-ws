import { Transaction } from "./transaction.model";
import { TransactionType } from "./transaction.model";
import { Transaction as SequelizeTransaction, Op } from "sequelize";
import { CreateTransactionWithUserDTO } from "./dtos";
import sequelize from "sequelize";

interface PositionResult {
  total: string | number | null;
}

export class TransactionRepository {
  async create(
    data: CreateTransactionWithUserDTO,
    transaction?: SequelizeTransaction
  ): Promise<Transaction> {
    return Transaction.create(data as Transaction, { transaction });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return Transaction.findAll({
      where: { userId },
      order: [["date", "DESC"]],
      include: ["stock"],
    });
  }

  async getCurrentPosition(
    userId: string,
    ticker: string,
    transaction?: SequelizeTransaction
  ): Promise<number> {
    const result = (await Transaction.findAll({
      where: {
        userId,
        ticker,
        type: {
          [Op.in]: [TransactionType.BUY, TransactionType.SELL],
        },
      },
      attributes: [
        [
          sequelize.fn(
            "SUM",
            sequelize.literal(
              "CASE WHEN type = 'BUY' THEN quantity ELSE -quantity END"
            )
          ),
          "total",
        ],
      ],
      transaction,
      raw: true,
    })) as unknown as PositionResult[];

    return Number(result[0]?.total || 0);
  }

  async findByUserIdAndType(
    userId: string,
    type: TransactionType,
    transaction?: SequelizeTransaction
  ): Promise<Transaction[]> {
    return Transaction.findAll({
      where: {
        userId,
        type,
      },
      order: [["date", "DESC"]],
      include: ["stock"],
      transaction,
    });
  }

  async findByPortfolioIdAndType(
    portfolioId: string,
    types: TransactionType[],
    transaction?: SequelizeTransaction
  ): Promise<Transaction[]> {
    return Transaction.findAll({
      where: {
        portfolioId,
        type: {
          [Op.in]: types,
        },
      },
      include: ["stock"],
      order: [["date", "DESC"]],
      transaction,
    });
  }

  async findByPortfolioIdAfterDate(
    portfolioId: string,
    date: Date,
    types: TransactionType[] = [],
    transaction?: SequelizeTransaction
  ): Promise<Transaction[]> {
    return Transaction.findAll({
      where: {
        portfolioId,
        type: types.length > 0 ? { [Op.in]: types } : undefined,
        date: {
          [Op.gte]: date,
        },
      },
      transaction,
    });
  }
}
