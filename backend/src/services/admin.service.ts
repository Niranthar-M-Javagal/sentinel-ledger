import { redis } from "../config/redis";
import { pool } from "../config/database";
import { randomUUID } from "crypto";
import {publishBlacklistChanged} from "./event-bus.service";
import {blacklistCounter} from "./metrics.service";
import { fundingCounter } from "./metrics.service";

export async function blacklistAccount(
    accountId: string
) {

    console.log(
        "[BLACKLIST] starting",
        accountId
    );

    await redis.set(
        `blacklist:${accountId}`,
        "BLOCKED"
    );

    const result =
        await pool.query(
            `
            INSERT INTO blacklisted_accounts(account_id)
            VALUES($1)
            ON CONFLICT(account_id)
            DO NOTHING
            RETURNING *
            `,
            [accountId]
        );

        await pool.query(
            `
            INSERT INTO blacklist_events(
                id,
                account_id,
                action
            )
            VALUES($1,$2,$3)
            `,
            [
                randomUUID(),
                accountId,
                "BLACKLISTED"
            ]
        );

        const results = await pool.query(`SELECT COUNT(*) FROM blacklisted_accounts`);

        blacklistCounter.set(
            Number(results.rows[0].count)
        );

    console.log(
        "[BLACKLIST] inserted",
        result.rows
    );

    await publishBlacklistChanged({
        accountId,
        action: "BLACKLISTED",
        timestamp: Date.now()
    });
}

export async function unblacklistAccount(
    accountId: string
) {
    await redis.del(
        `blacklist:${accountId}`
    );

    await pool.query(
        `
        DELETE FROM blacklisted_accounts
        WHERE account_id = $1
        `,
        [accountId]
    );

    await pool.query(
        `
        INSERT INTO blacklist_events(
            id,
            account_id,
            action
        )
        VALUES($1,$2,$3)
        `,
        [
            randomUUID(),
            accountId,
            "UNBLACKLISTED"
        ]
    );
    const result =
        await pool.query(`
            SELECT COUNT(*)
            FROM blacklisted_accounts
        `);

    blacklistCounter.set(
        Number(result.rows[0].count)
    );
    await publishBlacklistChanged({
        accountId,
        action: "UNBLACKLISTED",
        createdAt:
            new Date().toISOString()
    });
}

export async function getBlacklistedAccounts() {

    const result =
        await pool.query(`
            SELECT
                account_id,
                blacklisted_at
            FROM blacklisted_accounts
            ORDER BY blacklisted_at DESC
        `);

    return result.rows;
}

export async function fundAccount(
    accountId: string,
    amount: number
) {

    const client =
        await pool.connect();

    try {

        await client.query("BEGIN");

        const transactionId =
            randomUUID();

        const SYSTEM_ACCOUNT =
            "00000000-0000-0000-0000-000000000001";

        await client.query(
            `
            INSERT INTO transactions(
                id,
                from_account,
                to_account,
                amount
            )
            VALUES($1,$2,$3,$4)
            `,
            [
                transactionId,
                SYSTEM_ACCOUNT,
                accountId,
                amount
            ]
        );

        await client.query(
            `
            INSERT INTO ledger_entries(
                id,
                transaction_id,
                account_id,
                entry_type,
                amount
            )
            VALUES
            ($1,$2,$3,'DEBIT',$4),
            ($5,$2,$6,'CREDIT',$4)
            `,
            [
                randomUUID(),
                transactionId,
                SYSTEM_ACCOUNT,
                amount,
                randomUUID(),
                accountId
            ]
        );

        await client.query("COMMIT");

        fundingCounter.inc();

        return {
            transactionId
        };

    } catch (error) {

        await client.query(
            "ROLLBACK"
        );

        throw error;

    } finally {

        client.release();
    }
}