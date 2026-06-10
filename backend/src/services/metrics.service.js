"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsRegistry = exports.transferDuration = exports.blacklistCounter = exports.fraudCounter = exports.transactionCounter = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
prom_client_1.default.collectDefaultMetrics();
exports.transactionCounter = new prom_client_1.default.Counter({
    name: "sentinel_transactions_total",
    help: "Total transactions processed"
});
exports.fraudCounter = new prom_client_1.default.Counter({
    name: "sentinel_fraud_events_total",
    help: "Total fraud events detected"
});
exports.blacklistCounter = new prom_client_1.default.Gauge({
    name: "sentinel_blacklisted_accounts",
    help: "Currently blacklisted accounts"
});
exports.transferDuration = new prom_client_1.default.Histogram({
    name: "sentinel_transfer_duration_seconds",
    help: "Transfer latency",
    buckets: [
        0.01,
        0.05,
        0.1,
        0.5,
        1,
        2,
        5
    ]
});
exports.metricsRegistry = prom_client_1.default.register;
