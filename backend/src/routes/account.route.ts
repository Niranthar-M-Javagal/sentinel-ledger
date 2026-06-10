import express from "express";

import {
    createAccount,
    getAccountById,
    getAllAccounts,
    getAccountsWithStats,
    getAccountTimeline
} from "../services/account.service";

import {
    getAccountBalanceStandalone,
    getAccountTransactions
} from "../services/transaction.service";

const router = express.Router();

router.post("/accounts", async (req, res) => {

    try {

        const { ownerName } = req.body;

        if (!ownerName) {
            return res.status(400).json({
                error: "ownerName required"
            });
        }

        const account = await createAccount(ownerName);

        return res.status(201).json(account);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

router.get(
    "/accounts/stats",
    async (_req, res) => {

        const accounts =
            await getAccountsWithStats();

        return res.json(accounts);
    }
);

router.get("/accounts/:id/transactions", async (req, res) => {

    try {

        const accountId = req.params.id;

        const account = await getAccountById(accountId);

        if (!account) {
            return res.status(404).json({
                error: "Account not found"
            });
        }

        const limit = Number(req.query.limit) || 20;
        const offset = Number(req.query.offset) || 0;

        const transactions =
            await getAccountTransactions(
                accountId,
                limit,
                offset
            );

        return res.json(transactions);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

router.get(
    "/accounts/:id/timeline",
    async (req, res) => {

        const timeline =
            await getAccountTimeline(
                req.params.id
            );

        return res.json(
            timeline
        );
    }
);

router.get("/accounts/:id", async (req, res) => {

    try {

        const account = await getAccountById(req.params.id);

        if (!account) {
            return res.status(404).json({
                error: "Account not found"
            });
        }

        return res.json(account);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

router.get("/accounts/:id/balance", async (req, res) => {

    try {

        const accountId = req.params.id;

        const account = await getAccountById(accountId);

        if (!account) {
            return res.status(404).json({
                error: "Account not found"
            });
        }

        const balance = await getAccountBalanceStandalone(accountId);

        return res.json({
            accountId,
            balance
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

router.get("/accounts", async (_req, res) => {

    try {

        const accounts = await getAllAccounts();

        return res.json(accounts);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


export default router;