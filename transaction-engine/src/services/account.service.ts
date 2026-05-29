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