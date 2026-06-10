"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acquireLock = acquireLock;
exports.releaseLock = releaseLock;
const redis_1 = require("../config/redis");
async function acquireLock(accountId) {
    const key = `lock:${accountId}`;
    const result = await redis_1.redis.set(key, "LOCKED", {
        NX: true,
        EX: 10,
    });
    return result === "OK";
}
async function releaseLock(accountId) {
    const key = `lock:${accountId}`;
    await redis_1.redis.del(key);
}
