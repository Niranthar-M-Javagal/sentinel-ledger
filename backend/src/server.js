"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const transfer_route_1 = __importDefault(require("./routes/transfer.route"));
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const account_route_1 = __importDefault(require("./routes/account.route"));
const fraud_route_1 = __importDefault(require("./routes/fraud.route"));
const admin_route_1 = __importDefault(require("./routes/admin.route"));
const http_1 = __importDefault(require("http"));
const socket_1 = require("./socket/socket");
const event_route_1 = __importDefault(require("./routes/event.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const blacklist_recovery_service_1 = require("./services/blacklist-recovery.service");
const cors_1 = __importDefault(require("cors"));
const fraud_subscriber_service_1 = require("./services/fraud-subscriber.service");
const metrics_route_1 = __importDefault(require("./routes/metrics.route"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, socket_1.initializeSocket)(server);
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.use((0, cors_1.default)({
    origin: "http://localhost:5173"
}));
server.listen(3000, () => {
    console.log("Server running on port 3000");
});
dotenv_1.default.config();
app.use(express_1.default.json());
app.use(account_route_1.default);
app.use(transfer_route_1.default);
app.use(fraud_route_1.default);
app.use(metrics_route_1.default);
app.use("/events", event_route_1.default);
app.use("/dashboard", dashboard_route_1.default);
app.use(admin_route_1.default);
app.get("/health", async (req, res) => {
    try {
        await (0, database_1.testDatabase)();
        return res.status(200)
            .json({
            status: "healthy"
        });
    }
    catch {
        return res.status(500)
            .json({
            status: "database_failed"
        });
    }
});
const PORT = Number(process.env.PORT) || 3000;
async function start() {
    await (0, redis_1.connectRedis)();
    await (0, fraud_subscriber_service_1.startFraudSubscriber)();
    await (0, blacklist_recovery_service_1.restoreBlacklistCache)();
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}
start();
