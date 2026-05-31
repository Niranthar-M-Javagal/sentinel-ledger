import { redis } from "../config/redis";
import { pool } from "../config/database";


import {
    publishBlacklistChanged
} from "./event-bus.service";

export async function blacklistAccount(
    accountId: string
) {
    await redis.set(
        `blacklist:${accountId}`,
        "BLOCKED"
    );

    await pool.query(
        `
        INSERT INTO blacklisted_accounts(account_id)
        VALUES($1)
        ON CONFLICT(account_id)
        DO NOTHING
        `,
        [accountId]
    );

    publishBlacklistChanged({
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

    publishBlacklistChanged({
        accountId,
        action: "UNBLACKLISTED",
        timestamp: Date.now()
    });
}

export async function getBlacklistedAccounts() {

    const keys =
        await redis.keys(
            "blacklist:*"
        );

    return keys.map(
        key => key.replace(
            "blacklist:",
            ""
        )
    );
}