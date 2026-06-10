"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_service_1 = require("../services/dashboard.service");
const router = (0, express_1.Router)();
router.get("/metrics", async (_, res) => {
    const [accounts, fraudEvents, blacklisted] = await Promise.all([
        (0, dashboard_service_1.getAccountCount)(),
        (0, dashboard_service_1.getFraudCount)(),
        (0, dashboard_service_1.getBlacklistedCount)()
    ]);
    res.json({
        accounts,
        fraudEvents,
        blacklisted
    });
});
exports.default = router;
