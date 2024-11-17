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
      return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  };

  getPortfolioDetails = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const portfolioDetails = await this.portfolioService.getPortfolioDetails(
        userId
      );
      return res.status(200).json(portfolioDetails);
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "Portfólio não encontrado") {
          return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  };

  getPositions = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const positions = await this.portfolioService.getPositions(userId);
      return res.status(200).json(positions);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  };

  getPerformance = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user!.id;
      const performance = await this.portfolioService.getPerformance(userId);
      return res.status(200).json(performance);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: "Ocorreu um erro desconhecido" });
    }
  };
}
