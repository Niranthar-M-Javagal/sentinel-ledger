"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeTransactionEvent = storeTransactionEvent;
exports.storeFraudEvent = storeFraudEvent;
exports.storeBlacklistEvent = storeBlacklistEvent;
exports.getRecentTransactions = getRecentTransactions;
exports.getRecentFraudEvents = getRecentFraudEvents;
exports.getRecentBlacklistEvents = getRecentBlacklistEvents;
exports.getActivityEvents = getActivityEvents;
const redis_1 = require("../config/redis");
const MAX_EVENTS = 100;
async function storeTransactionEvent(event) {
    await redis_1.redis.lPush("recent-transactions", JSON.stringify(event));
    await redis_1.redis.lTrim("recent-transactions", 0, MAX_EVENTS - 1);
}
async function storeFraudEvent(event) {
    await redis_1.redis.lPush("recent-fraud-events", JSON.stringify(event));
    await redis_1.redis.lTrim("recent-fraud-events", 0, MAX_EVENTS - 1);
}
async function storeBlacklistEvent(event) {
    await redis_1.redis.lPush("recent-blacklist-events", JSON.stringify(event));
    await redis_1.redis.lTrim("recent-blacklist-events", 0, MAX_EVENTS - 1);
}
async function getRecentTransactions() {
    const events = await redis_1.redis.lRange("recent-transactions", 0, 99);
    return events.map((event) => JSON.parse(event));
}
async function getRecentFraudEvents() {
    const events = await redis_1.redis.lRange("recent-fraud-events", 0, 99);
    return events.map((event) => JSON.parse(event));
}
async function getRecentBlacklistEvents() {
    const events = await redis_1.redis.lRange("recent-blacklist-events", 0, 99);
    return events.map((event) => JSON.parse(event));
}
async function getActivityEvents() {
    const transactions = await getRecentTransactions();
    const fraudEvents = await getRecentFraudEvents();
    const blacklistEvents = await getRecentBlacklistEvents();
    const activity = [
        ...transactions.map(event => ({
            type: "TRANSFER_CREATED",
            timestamp: event.createdAt,
            data: event
        })),
        ...fraudEvents.map(event => ({
            type: "FRAUD_ALERT",
            timestamp: event.created_at,
            data: event
        })),
        ...blacklistEvents.map(event => ({
            type: "BLACKLIST_UPDATED",
            timestamp: event.createdAt,
            data: event
        }))
    ];
    activity.sort((a, b) => new Date(b.timestamp).getTime()
        -
            new Date(a.timestamp).getTime());
    return activity;
}
