import { createClient } from "redis";

import {
    publishFraudDetected
} from "./event-bus.service";

import {
    blacklistAccount
} from "./admin.service";

import {
    fraudCounter
} from "./metrics.service";

const subscriber =
    createClient({
        url:process.env.REDIS_URL
    });

export async function
startFraudSubscriber() {

    await subscriber.connect();

    await subscriber.subscribe(
        "fraud-alerts",
        async (message) => {

            const fraudEvent =
                JSON.parse(message);

            console.log(
                "Fraud Alert Received:",
                fraudEvent
            );

            await blacklistAccount(
                fraudEvent.account_id
            );

            await publishFraudDetected(
                fraudEvent
            );

            fraudCounter.inc();
        }
    );
}