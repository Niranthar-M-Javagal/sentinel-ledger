import express from "express";
import dotenv from "dotenv";
import transferRouter from "./routes/transfer.route";
import {    testDatabase    } from "./config/database";
import {    connectRedis    } from "./config/redis";
import {    idempotency     } from "./middleware/idempotency.middleware";
import {    blacklistCheck    } from "./middleware/blacklist.middleware";
import accountRouter from "./routes/account.route";
import fraudRouter from "./routes/fraud.route";
import adminRouter from "./routes/admin.route";


dotenv.config();

const app = express();

app.use(express.json());

app.use(accountRouter);

app.use(transferRouter);

app.use(fraudRouter);

app.use(adminRouter);


app.get(
    "/health",
    async (req,res) => {
        try {
            await testDatabase();
            return res.status(200)
                .json({
                    status:
                        "healthy"
                });

        } catch {
            return res.status(500)
                .json({
                    status:
                        "database_failed"
                });
        }
    }
);

const PORT =Number(process.env.PORT) || 3000;

async function start(){
    await connectRedis();
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

start();
