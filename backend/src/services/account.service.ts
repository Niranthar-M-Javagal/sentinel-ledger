import { pool } from "../config/database";
import { v4 as uuidv4 } from "uuid";

export async function createAccount(ownerName: string) {

    const id = uuidv4();

    const result = await pool.query(
        `
        INSERT INTO accounts (id, owner_name)
        VALUES ($1, $2)
        RETURNING *
        `,
        [id, ownerName]
    );

    return result.rows[0];
}

export async function getAccountById(id: string) {

    const result = await pool.query(
        `
        SELECT *
        FROM accounts
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

export async function getAllAccounts() {

    const result = await pool.query(
        `
        SELECT *
        FROM accounts
        ORDER BY created_at DESC
        `
    );

    return result.rows;
}

export async function getAccountsWithStats() {

    const result = await pool.query(`
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

export async function getAccountTimeline(
    accountId: string
) {

    const transactions =
        await pool.query(
            `
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
            `,
            [accountId]
        );

    const fraud =
        await pool.query(
            `
            SELECT
                'FRAUD' as type,
                reason as description,
                created_at

            FROM fraud_events

            WHERE account_id = $1
            `,
            [accountId]
        );

    const blacklistEvents =
    await pool.query(
        `
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
        `,
        [accountId]
    );

    const timeline = [

        ...transactions.rows,

        ...fraud.rows,

        ...blacklistEvents.rows
    ];

    timeline.sort(
        (a, b) =>
            new Date(
                b.created_at
            ).getTime()
            -
            new Date(
                a.created_at
            ).getTime()
    );

    return timeline;
}