import client from "prom-client";

client.collectDefaultMetrics();

export const transactionCounter =
    new client.Counter({
        name: "sentinel_transactions_total",
        help: "Total transactions processed"
    });

export const fraudCounter =
    new client.Counter({
        name: "sentinel_fraud_events_total",
        help: "Total fraud events detected"
    });

export const blacklistCounter =
    new client.Gauge({
        name: "sentinel_blacklisted_accounts",
        help: "Currently blacklisted accounts"
    });

export const transferDuration =
    new client.Histogram({
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

export const fundingCounter =
    new client.Counter({
        name: "sentinel_funding_total",
        help: "Total account funding operations"
    });

export const metricsRegistry =
    client.register;