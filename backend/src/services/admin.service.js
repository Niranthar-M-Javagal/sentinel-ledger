"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistAccount = blacklistAccount;
exports.unblacklistAccount = unblacklistAccount;
exports.getBlacklistedAccounts = getBlacklistedAccounts;
const redis_1 = require("../config/redis");
const database_1 = require("../config/database");
const crypto_1 = require("crypto");
const event_bus_service_1 = require("./event-bus.service");
const metrics_service_1 = require("./metrics.service");
async function blacklistAccount(accountId) {
    console.log("[BLACKLIST] starting", accountId);
    await redis_1.redis.set(`blacklist:${accountId}`, "BLOCKED");
    const result = await database_1.pool.query(`
            INSERT INTO blacklisted_accounts(account_id)
            VALUES($1)
            ON CONFLICT(account_id)
            DO NOTHING
            RETURNING *
            `, [accountId]);
    await database_1.pool.query(`
            INSERT INTO blacklist_events(
                id,
                account_id,
                action
            )
            VALUES($1,$2,$3)
            `, [
        (0, crypto_1.randomUUID)(),
        accountId,
        "BLACKLISTED"
    ]);
    const results = await database_1.pool.query(`SELECT COUNT(*) FROM blacklisted_accounts`);
    metrics_service_1.blacklistCounter.set(Number(results.rows[0].count));
    console.log("[BLACKLIST] inserted", result.rows);
    await (0, event_bus_service_1.publishBlacklistChanged)({
        accountId,
        action: "BLACKLISTED",
        timestamp: Date.now()
    });
}
async function unblacklistAccount(accountId) {
    await redis_1.redis.del(`blacklist:${accountId}`);
    await database_1.pool.query(`
        DELETE FROM blacklisted_accounts
        WHERE account_id = $1
        `, [accountId]);
    await database_1.pool.query(`
        INSERT INTO blacklist_events(
            id,
            account_id,
            action
        )
        VALUES($1,$2,$3)
        `, [
        (0, crypto_1.randomUUID)(),
        accountId,
        "UNBLACKLISTED"
    ]);
    const result = await database_1.pool.query(`
            SELECT COUNT(*)
            FROM blacklisted_accounts
        `);
    metrics_service_1.blacklistCounter.set(Number(result.rows[0].count));
    await (0, event_bus_service_1.publishBlacklistChanged)({
        accountId,
        action: "UNBLACKLISTED",
        createdAt: new Date().toISOString()
    });
}
async function getBlacklistedAccounts() {
    const result = await database_1.pool.query(`
            SELECT
                account_id,
                blacklisted_at
            FROM blacklisted_accounts
            ORDER BY blacklisted_at DESC
        `);
    return result.rows;
}
