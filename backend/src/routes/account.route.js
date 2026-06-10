"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_service_1 = require("../services/account.service");
const transaction_service_1 = require("../services/transaction.service");
const router = express_1.default.Router();
router.post("/accounts", async (req, res) => {
    try {
        const { ownerName } = req.body;
        if (!ownerName) {
            return res.status(400).json({
                error: "ownerName required"
            });
        }
        const account = await (0, account_service_1.createAccount)(ownerName);
        return res.status(201).json(account);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});
router.get("/accounts/stats", async (_req, res) => {
    const accounts = await (0, account_service_1.getAccountsWithStats)();
    return res.json(accounts);
});
router.get("/accounts/:id/transactions", async (req, res) => {
    try {
        const accountId = req.params.id;
        const account = await (0, account_service_1.getAccountById)(accountId);
        if (!account) {
            return res.status(404).json({
                error: "Account not found"
            });
        }
        const limit = Number(req.query.limit) || 20;
        const offset = Number(req.query.offset) || 0;
        const transactions = await (0, transaction_service_1.getAccountTransactions)(accountId, limit, offset);
        return res.json(transactions);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});
router.get("/accounts/:id/timeline", async (req, res) => {
    const timeline = await (0, account_service_1.getAccountTimeline)(req.params.id);
    return res.json(timeline);
});
router.get("/accounts/:id", async (req, res) => {
    try {
        const account = await (0, account_service_1.getAccountById)(req.params.id);
        if (!account) {
            return res.status(404).json({
                error: "Account not found"
            });
        }
        return res.json(account);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});
router.get("/accounts/:id/balance", async (req, res) => {
    try {
        const accountId = req.params.id;
        const account = await (0, account_service_1.getAccountById)(accountId);
        if (!account) {
            return res.status(404).json({
                error: "Account not found"
            });
        }
        const balance = await (0, transaction_service_1.getAccountBalanceStandalone)(accountId);
        return res.json({
            accountId,
            balance
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});
router.get("/accounts", async (_req, res) => {
    try {
        const accounts = await (0, account_service_1.getAllAccounts)();
        return res.json(accounts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});
exports.default = router;
