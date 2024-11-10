import { Request, Response } from "express";
import { WalletService } from "../domain/wallet";
import {
  DepositDTO,
  WithdrawDTO,
  ProfitabilityDTO,
  WalletSummaryDTO,
} from "../domain/wallet/dtos";

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  getWallet = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const walletSummary: WalletSummaryDTO =
        await this.walletService.getWalletSummary(userId);

      if (!walletSummary) {
        return res.status(404).json({ message: "Carteira não encontrada" });
      }

      return res.status(200).json(walletSummary);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  deposit = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const depositData: DepositDTO = req.body;

      if (!this.isValidMoneyOperation(depositData)) {
        return res.status(400).json({
          message: "Valor de depósito inválido ou dados incompletos",
        });
      }

      const updatedWallet = await this.walletService.deposit(
        userId,
        depositData
      );
      return res.status(200).json(updatedWallet);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  withdraw = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const withdrawalData: WithdrawDTO = req.body;

      if (!this.isValidMoneyOperation(withdrawalData)) {
        return res.status(400).json({
          message: "Valor de saque inválido ou dados incompletos",
        });
      }

      const updatedWallet = await this.walletService.withdraw(
        userId,
        withdrawalData
      );
      return res.status(200).json(updatedWallet);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Saldo insuficiente") {
          return res.status(400).json({ message: error.message });
        }
        if (error.message.includes("not found")) {
          return res.status(404).json({ message: "Carteira não encontrada" });
        }
      }
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getProfitability = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const { month, year } = req.query;

      if (!this.isValidPeriod(month as string, year as string)) {
        return res.status(400).json({
          message: "Período inválido",
        });
      }

      const profitability: ProfitabilityDTO =
        await this.walletService.getProfitability(
          userId,
          month as string,
          year as string
        );

      return res.status(200).json(profitability);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  private isValidMoneyOperation(
    data: Partial<DepositDTO | WithdrawDTO>
  ): boolean {
    return !!(data.amount && data.amount > 0);
  }

  private isValidPeriod(month?: string, year?: string): boolean {
    if (!month || !year) return false;

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    return !!(
      monthNum >= 1 &&
      monthNum <= 12 &&
      yearNum >= 2000 &&
      yearNum <= new Date().getFullYear()
    );
  }
}
