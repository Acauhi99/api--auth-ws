import { Request, Response } from "express";
import { PortfolioService } from "./portfolio.service";
import { AddStockDTO } from "./dtos";

export class PortfolioController {
  private portfolioService: PortfolioService;

  constructor() {
    this.portfolioService = new PortfolioService();
  }

  async getPortfolio(req: Request, res: Response) {
    const userId = req.user.id;
    const portfolio = await this.portfolioService.getPortfolioByUserId(userId);
    res.json(portfolio);
  }

  async addStockToPortfolio(req: Request, res: Response) {
    const userId = req.user.id;
    const addStockDTO: AddStockDTO = req.body;

    if (!addStockDTO.stockId || !addStockDTO.quantity) {
      return res
        .status(400)
        .json({ message: "stockId e quantity são obrigatórios." });
    }

    try {
      const result = await this.portfolioService.buyStock(
        userId,
        addStockDTO.stockId,
        addStockDTO.quantity
      );
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async removeStockFromPortfolio(req: Request, res: Response) {
    const userId = req.user.id;
    const { stockId } = req.params;
    const { quantity } = req.body;

    if (!stockId || !quantity) {
      return res
        .status(400)
        .json({ message: "stockId e quantity são obrigatórios." });
    }

    try {
      const result = await this.portfolioService.sellStock(
        userId,
        stockId,
        quantity
      );
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPortfolioSummary(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const summary = await this.portfolioService.getSummary(userId);
      res.json(summary);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  async getPortfolioPerformance(req: Request, res: Response) {
    const userId = req.user.id;
    try {
      const performance = await this.portfolioService.getPerformance(userId);
      res.json(performance);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
