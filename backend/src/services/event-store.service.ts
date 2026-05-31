import { redis } from "../config/redis";

const MAX_EVENTS = 100;

export async function storeTransactionEvent(event: any) {
    await redis.lPush(
        "recent-transactions",
        JSON.stringify(event)
    );

    await redis.lTrim(
        "recent-transactions",
        0,
        MAX_EVENTS - 1
    );
}

export async function storeFraudEvent(event: any) {
    await redis.lPush(
        "recent-fraud-events",
        JSON.stringify(event)
    );

    await redis.lTrim(
        "recent-fraud-events",
        0,
        MAX_EVENTS - 1
    );
}

export async function storeBlacklistEvent(event: any) {
    await redis.lPush(
        "recent-blacklist-events",
        JSON.stringify(event)
    );

    await redis.lTrim(
        "recent-blacklist-events",
        0,
        MAX_EVENTS - 1
    );
}

export async function getRecentTransactions() {
    const events = await redis.lRange(
        "recent-transactions",
        0,
        99
    );

    return events.map((event) => JSON.parse(event));
}

export async function getRecentFraudEvents() {
    const events = await redis.lRange(
        "recent-fraud-events",
        0,
        99
    );

    return events.map((event) => JSON.parse(event));
}

export async function getRecentBlacklistEvents() {
    const events = await redis.lRange(
        "recent-blacklist-events",
        0,
        99
    );

    return events.map((event) => JSON.parse(event));
}