import { pool } from "../config/database";
import { redis } from "../config/redis";

export async function restoreBlacklistCache() {

    const result = await pool.query(`
        SELECT account_id
        FROM blacklisted_accounts
    `);

    for (const row of result.rows) {

        await redis.set(
            `blacklist:${row.account_id}`,
            "BLOCKED"
        );
    }

    console.log(
        `Restored ${result.rows.length} blacklisted accounts`
    );
}