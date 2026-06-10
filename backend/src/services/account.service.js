"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = createAccount;
exports.getAccountById = getAccountById;
exports.getAllAccounts = getAllAccounts;
exports.getAccountsWithStats = getAccountsWithStats;
exports.getAccountTimeline = getAccountTimeline;
const database_1 = require("../config/database");
const uuid_1 = require("uuid");
async function createAccount(ownerName) {
    const id = (0, uuid_1.v4)();
    const result = await database_1.pool.query(`
        INSERT INTO accounts (id, owner_name)
        VALUES ($1, $2)
        RETURNING *
        `, [id, ownerName]);
    return result.rows[0];
}
async function getAccountById(id) {
    const result = await database_1.pool.query(`
        SELECT *
        FROM accounts
        WHERE id = $1
        `, [id]);
    return result.rows[0];
}
async function getAllAccounts() {
    const result = await database_1.pool.query(`
        SELECT *
        FROM accounts
        ORDER BY created_at DESC
        `);
    return result.rows;
}
async function getAccountsWithStats() {
    const result = await database_1.pool.query(`
        SELECT 
            a.id, 
            a.owner_name, 
            COALESCE(SUM(CASE WHEN le.entry_type = 'CREDIT' THEN le.amount ELSE -le.amount END), 0) AS balance, 
            COUNT(DISTINCT le.transaction_id) AS transaction_count, -- Added missing comma here
            CASE WHEN b.account_id IS NULL THEN false ELSE true END AS is_blacklisted 
        FROM accounts a 
        LEFT JOIN ledger_entries le ON a.id = le.account_id 
        LEFT JOIN blacklisted_accounts b ON b.account_id = a.id 
        GROUP BY a.id, a.owner_name, b.account_id -- Added b.account_id to avoid SQL standard errors
        ORDER BY a.owner_name;
    `);
    return result.rows;
}
async function getAccountTimeline(accountId) {
    const transactions = await database_1.pool.query(`
            SELECT
                'TRANSACTION' as type,

                CASE
                    WHEN from_account = $1
                    THEN CONCAT(
                        'Sent ₹',
                        amount
                    )
                    ELSE CONCAT(
                        'Received ₹',
                        amount
                    )
                END AS description,

                created_at

            FROM transactions

            WHERE
                from_account = $1
                OR
                to_account = $1
            `, [accountId]);
    const fraud = await database_1.pool.query(`
            SELECT
                'FRAUD' as type,
                reason as description,
                created_at

            FROM fraud_events

            WHERE account_id = $1
            `, [accountId]);
    const blacklistEvents = await database_1.pool.query(`
        SELECT
            action AS type,

            CASE
                WHEN action='BLACKLISTED'
                THEN 'Account blacklisted'
                ELSE 'Account unblacklisted'
            END AS description,

            created_at

        FROM blacklist_events

        WHERE account_id = $1
        `, [accountId]);
    const timeline = [
        ...transactions.rows,
        ...fraud.rows,
        ...blacklistEvents.rows
    ];
    timeline.sort((a, b) => new Date(b.created_at).getTime()
        -
            new Date(a.created_at).getTime());
    return timeline;
}
