import express from "express";

import {
    blacklistAccount,
    unblacklistAccount,
    getBlacklistedAccounts,
    fundAccount
} from "../services/admin.service";

const router = express.Router();

router.get(
    "/admin/blacklist",
    async (_req, res) => {

        const accounts =
            await getBlacklistedAccounts();

        console.log(accounts);

        return res.json(accounts);
    }
);

router.post(
    "/admin/unblacklist",
    async (req, res) => {

        const { accountId } =
            req.body;

        await unblacklistAccount(
            accountId
        );

        res.json({
            success: true
        });
    }
);

router.post(
    "/admin/blacklist/:accountId",
    async (req, res) => {

        await blacklistAccount(
            req.params.accountId
        );

        return res.json({
            message:
                "Account blacklisted"
        });
    }
);

router.delete(
    "/admin/blacklist/:accountId",
    async (req, res) => {

        await unblacklistAccount(
            req.params.accountId
        );

        return res.json({
            message:
                "Account unblacklisted"
        });
    }
);

router.post(
    "/admin/fund-account",
    async (req, res) => {

        const {
            accountId,
            amount
        } = req.body;

        const result =
            await fundAccount(
                accountId,
                amount
            );

        return res.json({
            success: true,
            ...result
        });
    }
);

export default router;