import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import analyticsRouter from "./analytics";
import predictRouter from "./predict";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(analyticsRouter);
router.use(predictRouter);
router.use(chatRouter);

export default router;
