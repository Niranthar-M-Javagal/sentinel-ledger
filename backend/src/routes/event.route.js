"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_store_service_1 = require("../services/event-store.service");
const router = (0, express_1.Router)();
router.get("/activity", async (_, res) => {
    const events = await (0, event_store_service_1.getActivityEvents)();
    res.json(events);
});
router.get("/recent-transactions", async (_, res) => {
    const events = await (0, event_store_service_1.getRecentTransactions)();
    res.json(events);
});
router.get("/recent-fraud", async (_, res) => {
    const events = await (0, event_store_service_1.getRecentFraudEvents)();
    res.json(events);
});
router.get("/recent-blacklist", async (_, res) => {
    const events = await (0, event_store_service_1.getRecentBlacklistEvents)();
    res.json(events);
});
exports.default = router;
