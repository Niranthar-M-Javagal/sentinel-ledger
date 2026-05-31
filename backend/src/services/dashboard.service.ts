import { pool } from "../config/database";
import { redis } from "../config/redis";

export async function getAccountCount() {
    const result = await pool.query(
        `SELECT COUNT(*) FROM accounts`
    );

    return Number(result.rows[0].count);
}

export async function getFraudCount() {
    const result = await pool.query(
        `SELECT COUNT(*) FROM fraud_events`
    );

    return Number(result.rows[0].count);
}

export async function getBlacklistedCount() {
    const keys =
        await redis.keys("blacklist:*");

    return keys.length;
}