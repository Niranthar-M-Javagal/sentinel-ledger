import express from "express";
import { getFraudEvents } from "../services/fraud.service";

const router = express.Router();

router.get(
    "/fraud-events",
    async (_req, res) => {

        try {

            const events =
                await getFraudEvents();

            return res.json(events);

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                error:
                    "Internal Server Error"
            });
        }
    }
);

export default router;