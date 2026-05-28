import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    max: 20
});

export async function testDatabase() {
    const client = await pool.connect();

    try {
        const result =
            await client.query(
                "SELECT NOW()"
            );

        console.log(
            "DB Connected:",
            result.rows[0]
        );
    } finally {
        client.release();
    }
}