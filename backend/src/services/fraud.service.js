"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFraudEvents = getFraudEvents;
const database_1 = require("../config/database");
async function getFraudEvents() {
    const result = await database_1.pool.query(`
        SELECT *
        FROM fraud_events
        ORDER BY created_at DESC
        `);
    return result.rows;
}
