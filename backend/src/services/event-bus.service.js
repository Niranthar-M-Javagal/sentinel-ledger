"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publishTransactionCreated = publishTransactionCreated;
exports.publishFraudDetected = publishFraudDetected;
exports.publishBlacklistChanged = publishBlacklistChanged;
const websocket_service_1 = require("./websocket.service");
const event_store_service_1 = require("./event-store.service");
async function publishTransactionCreated(payload) {
    await (0, event_store_service_1.storeTransactionEvent)(payload);
    (0, websocket_service_1.emitTransactionCreated)(payload);
}
async function publishFraudDetected(payload) {
    await (0, event_store_service_1.storeFraudEvent)(payload);
    (0, websocket_service_1.emitFraudAlert)(payload);
}
async function publishBlacklistChanged(payload) {
    await (0, event_store_service_1.storeBlacklistEvent)(payload);
    (0, websocket_service_1.emitBlacklistUpdated)(payload);
}
