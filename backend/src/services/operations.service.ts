import { pool } from "../config/database";
import {redis} from "../config/redis";

export async function getOperationsMetrics() {
    const [
        transactionsResult,
        fundingResult,
        fraudResult,
        blacklistResult
    ] = await Promise.all([
        pool.query(
            "SELECT COUNT(*) FROM transactions"
        ),

        pool.query(`
            SELECT COUNT(*)
            FROM transactions
            WHERE from_account =
            '00000000-0000-0000-0000-000000000001'
        `),

        pool.query(
            "SELECT COUNT(*) FROM fraud_events"
        ),

        pool.query(
            "SELECT COUNT(*) FROM blacklisted_accounts"
        )
    ]);

    let redisHealthy = false;

    try {
        await redis.ping();
        redisHealthy = true;
    } catch {}

    const heartbeat =
        await redis.get("worker:heartbeat");

    const workerHealthy =
        heartbeat !== null &&
        Date.now() / 1000 - Number(heartbeat) < 30;

    return {
        transactionsProcessed: Number(
            transactionsResult.rows[0].count
        ),

        fundingOperations: Number(
            fundingResult.rows[0].count
        ),

        fraudEvents: Number(
            fraudResult.rows[0].count
        ),

        blacklistedAccounts: Number(
            blacklistResult.rows[0].count
        ),

        health: {
            postgres: true,
            redis: redisHealthy,
            worker: workerHealthy
        }
    };
}