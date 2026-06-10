"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishTransactionEvent = publishTransactionEvent;
const redis_1 = require("../config/redis");
async function publishTransactionEvent(transactionId, fromAccount, toAccount, amount) {
    await redis_1.redis.xAdd("transactions-stream", "*", {
        transactionId,
        fromAccount,
        toAccount,
        amount: amount.toString(),
        timestamp: Date.now().toString()
    });
}
