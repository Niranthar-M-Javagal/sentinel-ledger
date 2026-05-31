import { getIO } from "../socket/socket";

export function emitTransactionCreated(data: any) {
    getIO().emit("transaction_created", data);
}

export function emitFraudAlert(data: any) {
    getIO().emit("fraud_alert", data);
}

export function emitBlacklistUpdated(data: any) {
    getIO().emit("blacklist_updated", data);
}