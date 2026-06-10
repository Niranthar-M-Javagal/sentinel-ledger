"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountBalance = getAccountBalance;
exports.getAccountBalanceStandalone = getAccountBalanceStandalone;
exports.getAccountTransactions = getAccountTransactions;
const database_1 = require("../config/database");
async function getAccountBalance(client, accountId) {
    const result = await client.query(`
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
`, [accountId]);
    return Number(result.rows[0].balance);
}
async function getAccountBalanceStandalone(accountId) {
    const client = await database_1.pool.connect();
    try {
        return await getAccountBalance(client, accountId);
    }
    finally {
        client.release();
    }
}
async function getAccountTransactions(accountId, limit = 20, offset = 0) {
    const result = await database_1.pool.query(`
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
        `, [accountId, limit, offset]);
    return result.rows;
}
