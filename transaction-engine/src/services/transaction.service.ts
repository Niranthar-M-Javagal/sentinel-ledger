import { PoolClient } from "pg";

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