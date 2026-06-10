"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blacklistCheck = blacklistCheck;
const redis_1 = require("../config/redis");
async function blacklistCheck(req, res, next) {
    try {
        const fromAccount = req.body.fromAccount;
        if (!fromAccount) {
            next();
            return;
        }
        const blacklistKey = `blacklist:${fromAccount}`;
        const blocked = await redis_1.redis.get(blacklistKey);
        if (blocked) {
            res.status(403).json({
                error: "Account Blacklisted"
            });
            return;
        }
        next();
    }
    catch (err) {
        console.log("Blacklist Middleware Error:", err);
        res.status(500).json({
            error: "blacklist_check_failed"
        });
    }
}
