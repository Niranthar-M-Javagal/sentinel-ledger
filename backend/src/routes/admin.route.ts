import express from "express";

import {
    blacklistAccount,
    unblacklistAccount,
    getBlacklistedAccounts
} from "../services/admin.service";

const router = express.Router();

router.get(
    "/admin/blacklist",
    async (_req, res) => {

        const accounts =
            await getBlacklistedAccounts();

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

export default router;