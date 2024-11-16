import { Router } from "express";
import { PortfolioController } from "./portfolio.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const portfolioRouter = Router();
const portfolioController = new PortfolioController();

portfolioRouter.use(authenticateHandler);

portfolioRouter.get(
  "/",
  asyncHandler(portfolioController.getPortfolio.bind(portfolioController))
);
portfolioRouter.post(
  "/stocks",
  asyncHandler(
    portfolioController.addStockToPortfolio.bind(portfolioController)
  )
);
portfolioRouter.delete(
  "/stocks/:stockId",
  asyncHandler(
    portfolioController.removeStockFromPortfolio.bind(portfolioController)
  )
);
portfolioRouter.get(
  "/summary",
  asyncHandler(
    portfolioController.getPortfolioSummary.bind(portfolioController)
  )
);
portfolioRouter.get(
  "/performance",
  asyncHandler(
    portfolioController.getPortfolioPerformance.bind(portfolioController)
  )
);

export { portfolioRouter };
