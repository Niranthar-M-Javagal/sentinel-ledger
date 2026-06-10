import { Router } from "express";
import {
    getOperationsMetrics
} from "../services/operations.service";

const router = Router();

router.get(
    "/metrics",
    async (_, res) => {

        const metrics =
            await getOperationsMetrics();

        res.json(metrics);
    }
);

export default router;