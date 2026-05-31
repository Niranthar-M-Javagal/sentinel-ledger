import { Router } from "express";

import {
    getRecentTransactions,
    getRecentFraudEvents,
    getRecentBlacklistEvents
} from "../services/event-store.service";

const router = Router();

router.get(
    "/recent-transactions",
    async (_, res) => {
        const events =
            await getRecentTransactions();

        res.json(events);
    }
);

router.get(
    "/recent-fraud",
    async (_, res) => {
        const events =
            await getRecentFraudEvents();

        res.json(events);
    }
);

router.get(
    "/recent-blacklist",
    async (_, res) => {
        const events =
            await getRecentBlacklistEvents();

        res.json(events);
    }
);

export default router;