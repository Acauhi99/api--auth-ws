import { Op } from "sequelize";
import { Wallet } from "./wallet.model";
import { WalletStock } from "./wallet-stock.model";
import { Stock } from "../stock";
import { Transaction } from "../transaction";
import { WalletSummaryDTO } from "./dtos";

interface WalletWithStocks extends Wallet {
  WalletStocks?: Array<{
    quantity: number;
    averagePurchasePrice: number;
    Stock: {
      ticker: string;
      currentPrice: number;
    };
  }>;
}

interface WalletStockWithStock extends WalletStock {
  Stock: {
    currentPrice: number;
  };
}

export class WalletRepository {
  async findById(id: string): Promise<Wallet> {
    const wallet = await Wallet.findByPk(id);
    if (!wallet) throw new Error("Wallet not found");
    return wallet;
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return Wallet.findOne({ where: { userId } });
  }

  async create(userId: string): Promise<Wallet> {
    return Wallet.create({
      userId,
      availableBalance: 0,
    });
  }

  async update(id: string, data: Partial<Wallet>): Promise<void> {
    await Wallet.update(data, { where: { id } });
  }

  async getWalletSummary(walletId: string): Promise<WalletSummaryDTO> {
    const wallet = (await Wallet.findByPk(walletId, {
      include: [
        {
          model: WalletStock,
          include: [{ model: Stock }],
        },
      ],
    })) as WalletWithStocks | null;

    if (!wallet) throw new Error("Wallet not found");

    const stocks =
      wallet.WalletStocks?.map((position) => ({
        ticker: position.Stock.ticker,
        quantity: position.quantity,
        averagePrice: position.averagePurchasePrice,
        currentPrice: position.Stock.currentPrice,
        profitability:
          ((position.Stock.currentPrice - position.averagePurchasePrice) /
            position.averagePurchasePrice) *
          100,
      })) || [];

    const totalInvested = stocks.reduce(
      (sum: number, stock) => sum + stock.quantity * stock.averagePrice,
      0
    );

    const totalBalance =
      stocks.reduce(
        (sum: number, stock) => sum + stock.quantity * stock.currentPrice,
        0
      ) + wallet.availableBalance;

    const totalProfitability =
      totalInvested > 0
        ? ((totalBalance - totalInvested) / totalInvested) * 100
        : 0;

    return {
      totalBalance,
      totalInvested,
      totalDividends: 0,
      totalProfitability,
      stocks,
    };
  }

  async calculateProfitability(
    walletId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    transactions: Transaction[];
    appreciation: number;
  }> {
    const transactions = await Transaction.findAll({
      where: {
        walletId,
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    const positions = (await WalletStock.findAll({
      where: { walletId },
      include: [{ model: Stock }],
    })) as WalletStockWithStock[];

    const appreciation = positions.reduce(
      (sum: number, position: WalletStockWithStock) => {
        const currentValue = position.quantity * position.Stock.currentPrice;
        const costBasis = position.quantity * position.averagePurchasePrice;
        return sum + (currentValue - costBasis);
      },
      0
    );

    return {
      transactions,
      appreciation,
    };
  }
}
