"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitTransactionCreated = emitTransactionCreated;
exports.emitFraudAlert = emitFraudAlert;
exports.emitBlacklistUpdated = emitBlacklistUpdated;
const socket_1 = require("../socket/socket");
function emitTransactionCreated(data) {
    (0, socket_1.getIO)().emit("transaction_created", data);
}
function emitFraudAlert(data) {
    (0, socket_1.getIO)().emit("fraud_alert", data);
}
function emitBlacklistUpdated(data) {
    (0, socket_1.getIO)().emit("blacklist_updated", data);
}
