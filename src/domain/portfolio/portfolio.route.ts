import { Router } from "express";
import { PortfolioController } from "./portfolio.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const portfolioRouter = Router();
const portfolioController = new PortfolioController();

portfolioRouter.use(authenticateHandler);

portfolioRouter.post("/", asyncHandler(portfolioController.createPortfolio));

portfolioRouter.get(
  "/overview",
  asyncHandler(portfolioController.getPortfolioOverview)
);

portfolioRouter.get(
  "/performance/monthly",
  asyncHandler(portfolioController.getMonthlyPerformance)
);

portfolioRouter.get(
  "/dividends",
  asyncHandler(portfolioController.getDividendsHistory)
);

portfolioRouter.get(
  "/history",
  asyncHandler(portfolioController.getPortfolioHistory)
);

export { portfolioRouter };
