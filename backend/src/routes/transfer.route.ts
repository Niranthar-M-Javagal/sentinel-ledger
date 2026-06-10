import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { pool } from "../config/database";
import { TransferRequest } from "../types/transfer";
import { getAccountBalance } from "../services/transaction.service";
import {  acquireLock,releaseLock,} from "../services/lock.service";
import {  publishTransactionEvent  } from "../services/stream.service";
import { idempotency } from "../middleware/idempotency.middleware";
import { blacklistCheck } from "../middleware/blacklist.middleware";
import {    publishTransactionCreated   } from "../services/event-bus.service";
import {transactionCounter} from "../services/metrics.service";
import {transferDuration} from "../services/metrics.service";
const router = Router();

router.post(
    "/transfer",
    idempotency,
    blacklistCheck,
    async (req, res) => {
    const body = req.body as TransferRequest;

    const client = await pool.connect();

    const locked = await acquireLock(
      body.fromAccount
    );

    if (!locked) {
      client.release();

      return res.status(423).json({
        error: "Account Locked",
      });
    }

    try {
      const endTimer = transferDuration.startTimer();
      await client.query("BEGIN");

      const lockQuery = `
        SELECT id
        FROM accounts
        WHERE id = $1
        FOR UPDATE
      `;

      await client.query(
        lockQuery,
        [body.fromAccount]
      );

      await client.query(
        lockQuery,
        [body.toAccount]
      );

      const balance =
        await getAccountBalance(
          client,
          body.fromAccount
        );

      if (balance < body.amount) {
        await client.query(
          "ROLLBACK"
        );

        return res.status(400).json({
          error:
            "Insufficient balance",
        });
      }

      const txId = uuid();

      await client.query(
        `
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
        `,
        [
          txId,
          body.fromAccount,
          body.toAccount,
          body.amount,
        ]
      );

      await client.query(
        `
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
        `,
        [
          uuid(),
          txId,
          body.fromAccount,
          body.amount,

          uuid(),
          body.toAccount,
        ]
      );

      await client.query(
        "COMMIT"
      );

      transactionCounter.inc();

      await publishTransactionEvent(
        txId,
        body.fromAccount,
        body.toAccount,
        body.amount
      );

      publishTransactionCreated({
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

    } catch (error) {
      await client.query(
        "ROLLBACK"
      );

      console.error(error);

      return res.status(500).json({
        error:
          "transfer_failed",
      });

    } finally {
      await releaseLock(
        body.fromAccount
      );

      client.release();
    }
  }
);

export default router;