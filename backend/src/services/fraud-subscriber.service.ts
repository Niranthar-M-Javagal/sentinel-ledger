import { createClient } from "redis";

import {
    publishFraudDetected
} from "./event-bus.service";

const subscriber =
    createClient({
        url: "redis://localhost:6379"
    });

export async function
startFraudSubscriber() {

    await subscriber.connect();

    await subscriber.subscribe(
        "fraud-alerts",
        async (message) => {

            const payload =
                JSON.parse(message);

            console.log(
                "Fraud Alert Received:",
                payload
            );

            await publishFraudDetected(
                payload
            );
        }
    );
}