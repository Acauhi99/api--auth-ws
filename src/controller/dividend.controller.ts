import { Request, Response } from "express";
import { DividendService } from "../domain/dividend";
import { CreateDividendDTO, DividendSummaryDTO } from "../domain/dividend/dtos";

export class DividendController {
  private dividendService: DividendService;

  constructor() {
    this.dividendService = new DividendService();
  }

  getDividends = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const dividendSummary: DividendSummaryDTO =
        await this.dividendService.getDividendsByUserId(userId);

      return res.status(200).json(dividendSummary);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  createDividend = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const dividendData: CreateDividendDTO = {
        ...req.body,
        userId,
      };

      if (!this.isValidCreateDividendDTO(dividendData)) {
        return res.status(400).json({
          message:
            "Dados incompletos. stockId, walletId, amount, paymentDate e declaredDate são obrigatórios",
        });
      }

      const newDividend = await this.dividendService.createDividend(
        dividendData
      );

      return res.status(201).json(newDividend);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  private isValidCreateDividendDTO(
    data: Partial<CreateDividendDTO>
  ): data is CreateDividendDTO {
    return !!(
      data.stockId &&
      data.walletId &&
      data.amount &&
      data.paymentDate &&
      data.declaredDate
    );
  }
}
