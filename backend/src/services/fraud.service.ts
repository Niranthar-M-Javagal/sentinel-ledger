import { pool } from "../config/database";

export async function getFraudEvents() {

    const result = await pool.query(
        `
        SELECT *
        FROM fraud_events
        ORDER BY created_at DESC
        `
    );

    return result.rows;
}