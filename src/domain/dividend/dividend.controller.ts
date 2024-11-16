import { Request, Response } from "express";
import { DividendService } from "./dividend.service";
import { CreateDividendDTO } from "./dtos";

export class DividendController {
  private dividendService: DividendService;

  constructor() {
    this.dividendService = new DividendService();
  }

  getDividends = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const dividends = await this.dividendService.getDividendsByUserId(userId);
      return res.status(200).json(dividends);
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
            "Dados incompletos. stockId, portfolioId, amount, paymentDate e declaredDate são obrigatórios",
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

  getDividendSummary = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const summary = await this.dividendService.getDividendSummary(userId);
      return res.status(200).json(summary);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getDividendCalendar = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const { month, year } = req.query;

      const calendar = await this.dividendService.getDividendCalendar(
        userId,
        Number(month) || new Date().getMonth() + 1,
        Number(year) || new Date().getFullYear()
      );

      return res.status(200).json(calendar);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getStockDividendHistory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const { stockId } = req.params;

      if (!stockId) {
        return res.status(400).json({ message: "Stock ID é obrigatório" });
      }

      const history = await this.dividendService.getStockDividendHistory(
        userId,
        stockId
      );
      return res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  private isValidCreateDividendDTO(
    data: Partial<CreateDividendDTO>
  ): data is CreateDividendDTO {
    return !!(
      data.stockId &&
      data.portfolioId &&
      data.amount &&
      data.paymentDate &&
      data.declaredDate
    );
  }
}
