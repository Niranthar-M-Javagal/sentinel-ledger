"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const database_1 = require("../config/database");
const transaction_service_1 = require("../services/transaction.service");
const lock_service_1 = require("../services/lock.service");
const stream_service_1 = require("../services/stream.service");
const idempotency_middleware_1 = require("../middleware/idempotency.middleware");
const blacklist_middleware_1 = require("../middleware/blacklist.middleware");
const event_bus_service_1 = require("../services/event-bus.service");
const metrics_service_1 = require("../services/metrics.service");
const metrics_service_2 = require("../services/metrics.service");
const router = (0, express_1.Router)();
router.post("/transfer", idempotency_middleware_1.idempotency, blacklist_middleware_1.blacklistCheck, async (req, res) => {
    const body = req.body;
    const client = await database_1.pool.connect();
    const locked = await (0, lock_service_1.acquireLock)(body.fromAccount);
    if (!locked) {
        client.release();
        return res.status(423).json({
            error: "Account Locked",
        });
    }
    try {
        const endTimer = metrics_service_2.transferDuration.startTimer();
        await client.query("BEGIN");
        const lockQuery = `
        SELECT id
        FROM accounts
        WHERE id = $1
        FOR UPDATE
      `;
        await client.query(lockQuery, [body.fromAccount]);
        await client.query(lockQuery, [body.toAccount]);
        const balance = await (0, transaction_service_1.getAccountBalance)(client, body.fromAccount);
        if (balance < body.amount) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                error: "Insufficient balance",
            });
        }
        const txId = (0, uuid_1.v4)();
        await client.query(`
        INSERT INTO transactions (
          id,
          from_account,
          to_account,
          amount,
          created_at
        )
        VALUES (
          $1,
          $2,
          $3,
          $4,
          NOW()
        )
        `, [
            txId,
            body.fromAccount,
            body.toAccount,
            body.amount,
        ]);
        await client.query(`
        INSERT INTO ledger_entries (
          id,
          transaction_id,
          account_id,
          entry_type,
          amount,
          created_at
        )
        VALUES
          ($1, $2, $3, 'DEBIT',  $4, NOW()),
          ($5, $2, $6, 'CREDIT', $4, NOW())
        `, [
            (0, uuid_1.v4)(),
            txId,
            body.fromAccount,
            body.amount,
            (0, uuid_1.v4)(),
            body.toAccount,
        ]);
        await client.query("COMMIT");
        metrics_service_1.transactionCounter.inc();
        await (0, stream_service_1.publishTransactionEvent)(txId, body.fromAccount, body.toAccount, body.amount);
        (0, event_bus_service_1.publishTransactionCreated)({
            transactionId: txId,
            fromAccount: body.fromAccount,
            toAccount: body.toAccount,
            amount: body.amount,
            eventType: "TRANSFER_CREATED",
            createdAt: new Date().toISOString()
        });
        endTimer();
        return res.status(200).json({
            transactionId: txId,
        });
    }
    catch (error) {
        await client.query("ROLLBACK");
        console.error(error);
        return res.status(500).json({
            error: "transfer_failed",
        });
    }
    finally {
        await (0, lock_service_1.releaseLock)(body.fromAccount);
        client.release();
    }
});
exports.default = router;
