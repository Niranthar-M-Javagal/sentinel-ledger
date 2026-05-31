import { Router } from "express";

import {
    getAccountCount,
    getFraudCount,
    getBlacklistedCount
} from "../services/dashboard.service";

const router = Router();

router.get(
    "/metrics",
    async (_, res) => {

        const [
            accounts,
            fraudEvents,
            blacklisted
        ] = await Promise.all([
            getAccountCount(),
            getFraudCount(),
            getBlacklistedCount()
        ]);

        res.json({
            accounts,
            fraudEvents,
            blacklisted
        });
    }
);

export default router;