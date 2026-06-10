import express from "express";

import {
    metricsRegistry
} from "../services/metrics.service";

const router = express.Router();

router.get(
    "/metrics",
    async (_req, res) => {

        res.set(
            "Content-Type",
            metricsRegistry.contentType
        );

        res.end(
            await metricsRegistry.metrics()
        );
    }
);

export default router;