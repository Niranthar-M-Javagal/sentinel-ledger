import {
    emitTransactionCreated,
    emitFraudAlert,
    emitBlacklistUpdated
} from "./websocket.service";

import {
    storeTransactionEvent,
    storeFraudEvent,
    storeBlacklistEvent
} from "./event-store.service";

export async function publishTransactionCreated(
    payload: any
) {
    await storeTransactionEvent(payload);

    emitTransactionCreated(payload);
}

export async function publishFraudDetected(
    payload: any
) {
    await storeFraudEvent(payload);

    emitFraudAlert(payload);
}

export async function publishBlacklistChanged(
    payload: any
) {
    await storeBlacklistEvent(payload);

    emitBlacklistUpdated(payload);
}