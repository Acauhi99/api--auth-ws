import { Router } from "express";
import { DividendController } from "./dividend.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const dividendRouter = Router();
const dividendController = new DividendController();

dividendRouter.use(authenticateHandler);

dividendRouter.get("/", asyncHandler(dividendController.getDividends));
dividendRouter.post("/", asyncHandler(dividendController.createDividend));
dividendRouter.get(
  "/summary",
  asyncHandler(dividendController.getDividendSummary)
);
dividendRouter.get(
  "/calendar",
  asyncHandler(dividendController.getDividendCalendar)
);
dividendRouter.get(
  "/history/:stockId",
  asyncHandler(dividendController.getStockDividendHistory)
);

export { dividendRouter };
