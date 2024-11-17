import { Request, Response } from "express";
import { PortfolioService } from "./portfolio.service";

export class PortfolioController {
  private portfolioService: PortfolioService;

  constructor() {
    this.portfolioService = new PortfolioService();
  }

  createPortfolio = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const portfolio = await this.portfolioService.createPortfolio(userId);
      return res.status(201).json(portfolio);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Portfolio already exists") {
          return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "An unknown error occurred" });
    }
  };

  getPortfolioOverview = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const overview = await this.portfolioService.getOverview(userId);
      return res.status(200).json(overview);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getMonthlyPerformance = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const performance = await this.portfolioService.getMonthlyPerformance(
        userId
      );
      return res.status(200).json(performance);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getDividendsHistory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const dividends = await this.portfolioService.getDividendsHistory(userId);
      return res.status(200).json(dividends);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };

  getPortfolioHistory = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const history = await this.portfolioService.getPortfolioHistory(userId);
      return res.status(200).json(history);
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  };
}
