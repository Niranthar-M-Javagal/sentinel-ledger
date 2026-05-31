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
import http from "http";
import { initializeSocket } from "./socket/socket";
import eventRoutes from "./routes/event.route";
import dashboardRoutes from "./routes/dashboard.route";
import { restoreBlacklistCache } from "./services/blacklist-recovery.service";
import cors from "cors";

import path from "path";

const app = express();

const server = http.createServer(app);

initializeSocket(server);

app.use(
    express.static(
        path.join(__dirname, "../public")
    )
);

app.use(cors({
    origin: "http://localhost:5173"
}));

server.listen(3000, () => {
    console.log("Server running on port 3000");
});

dotenv.config();

app.use(express.json());

app.use(accountRouter);

app.use(transferRouter);

app.use(fraudRouter);

app.use("/events", eventRoutes);

app.use("/dashboard",dashboardRoutes);

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
    await restoreBlacklistCache();
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

start();
