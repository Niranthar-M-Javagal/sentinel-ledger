"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restoreBlacklistCache = restoreBlacklistCache;
const database_1 = require("../config/database");
const redis_1 = require("../config/redis");
async function restoreBlacklistCache() {
    const result = await database_1.pool.query(`
        SELECT account_id
        FROM blacklisted_accounts
    `);
    for (const row of result.rows) {
        await redis_1.redis.set(`blacklist:${row.account_id}`, "BLOCKED");
    }
    console.log(`Restored ${result.rows.length} blacklisted accounts`);
}
