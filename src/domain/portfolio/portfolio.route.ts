import { Router } from "express";
import { PortfolioController } from "./portfolio.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const portfolioRouter = Router();
const portfolioController = new PortfolioController();

portfolioRouter.use(authenticateHandler);

portfolioRouter.post("/", asyncHandler(portfolioController.createPortfolio));

portfolioRouter.get("/", asyncHandler(portfolioController.getPortfolioDetails));

portfolioRouter.get(
  "/positions",
  asyncHandler(portfolioController.getPositions)
);

portfolioRouter.get(
  "/performance",
  asyncHandler(portfolioController.getPerformance)
);

export { portfolioRouter };
