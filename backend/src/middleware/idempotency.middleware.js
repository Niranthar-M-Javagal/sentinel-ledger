"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.idempotency = idempotency;
const redis_1 = require("../config/redis");
async function idempotency(req, res, next) {
    console.log("=== MIDDLEWARE HIT ===");
    try {
        const key = req.header("X-Idempotency-Key");
        console.log("Header:", key);
        if (!key) {
            res.status(400).json({
                error: "Missing X-Idempotency-Key",
            });
            return;
        }
        const redisKey = `idem:${key}`;
        console.log("Checking:", redisKey);
        const existing = await redis_1.redis.get(redisKey);
        console.log("Existing:", existing);
        if (existing !== null) {
            res.status(409).json({
                error: "Duplicate Request",
            });
            return;
        }
        console.log("Writing to Redis...");
        await redis_1.redis.set(redisKey, "STARTED");
        const verify = await redis_1.redis.get(redisKey);
        console.log("Stored Value:", verify);
        next();
    }
    catch (error) {
        console.error("Middleware Error:", error);
        res.status(500).json({
            error: "middleware_failed",
        });
    }
}
