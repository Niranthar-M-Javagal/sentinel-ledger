"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountCount = getAccountCount;
exports.getFraudCount = getFraudCount;
exports.getBlacklistedCount = getBlacklistedCount;
const database_1 = require("../config/database");
const redis_1 = require("../config/redis");
async function getAccountCount() {
    const result = await database_1.pool.query(`SELECT COUNT(*) FROM accounts`);
    return Number(result.rows[0].count);
}
async function getFraudCount() {
    const result = await database_1.pool.query(`SELECT COUNT(*) FROM fraud_events`);
    return Number(result.rows[0].count);
}
async function getBlacklistedCount() {
    const keys = await redis_1.redis.keys("blacklist:*");
    return keys.length;
}
