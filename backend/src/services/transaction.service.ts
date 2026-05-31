import { PoolClient } from "pg";
import { pool } from "../config/database";

export async function getAccountBalance(
    client: PoolClient,
    accountId: string
) {

    const result =
        await client.query(
            `
SELECT
COALESCE(
SUM(
CASE
WHEN entry_type='CREDIT'
THEN amount
ELSE -amount
END
),
0
)
AS balance
FROM ledger_entries
WHERE account_id=$1
`,
            [accountId]
        );

    return Number(
        result.rows[0].balance
    );

}

export async function getAccountBalanceStandalone(
    accountId: string
) {

    const client = await pool.connect();

    try {

        return await getAccountBalance(
            client,
            accountId
        );

    } finally {

        client.release();
    }
}
export async function getAccountTransactions(
    accountId: string,
    limit: number = 20,
    offset: number = 0
) {
    const result = await pool.query(
        `
        SELECT
            transaction_id,
            entry_type,
            amount,
            created_at
        FROM ledger_entries
        WHERE account_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        OFFSET $3
        `,
        [accountId, limit, offset]
    );

    return result.rows;
}