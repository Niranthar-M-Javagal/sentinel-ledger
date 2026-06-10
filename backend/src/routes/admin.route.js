"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_service_1 = require("../services/admin.service");
const router = express_1.default.Router();
router.get("/admin/blacklist", async (_req, res) => {
    const accounts = await (0, admin_service_1.getBlacklistedAccounts)();
    console.log(accounts);
    return res.json(accounts);
});
router.post("/admin/unblacklist", async (req, res) => {
    const { accountId } = req.body;
    await (0, admin_service_1.unblacklistAccount)(accountId);
    res.json({
        success: true
    });
});
router.post("/admin/blacklist/:accountId", async (req, res) => {
    await (0, admin_service_1.blacklistAccount)(req.params.accountId);
    return res.json({
        message: "Account blacklisted"
    });
});
router.delete("/admin/blacklist/:accountId", async (req, res) => {
    await (0, admin_service_1.unblacklistAccount)(req.params.accountId);
    return res.json({
        message: "Account unblacklisted"
    });
});
exports.default = router;
