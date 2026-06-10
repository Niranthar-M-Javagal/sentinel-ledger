"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startFraudSubscriber = startFraudSubscriber;
const redis_1 = require("redis");
const event_bus_service_1 = require("./event-bus.service");
const admin_service_1 = require("./admin.service");
const metrics_service_1 = require("./metrics.service");
const subscriber = (0, redis_1.createClient)({
    url: "redis://localhost:6379"
});
async function startFraudSubscriber() {
    await subscriber.connect();
    await subscriber.subscribe("fraud-alerts", async (message) => {
        const fraudEvent = JSON.parse(message);
        console.log("Fraud Alert Received:", fraudEvent);
        await (0, admin_service_1.blacklistAccount)(fraudEvent.account_id);
        await (0, event_bus_service_1.publishFraudDetected)(fraudEvent);
        metrics_service_1.fraudCounter.inc();
    });
}
