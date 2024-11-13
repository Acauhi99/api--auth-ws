import { Router } from "express";
import { DividendController } from "./dividend.controller";
import { asyncHandler, authenticateHandler } from "../../middlewares";

const dividendRouter = Router();
const dividendController = new DividendController();

dividendRouter.use(authenticateHandler);

dividendRouter.get("/", asyncHandler(dividendController.getDividends));
dividendRouter.post("/", asyncHandler(dividendController.createDividend));

export { dividendRouter };
