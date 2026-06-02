import { useEffect } from "react";
import { socket } from "../services/socket";
import type { FraudEvent } from "../types/fraud";

export function useFraudSocket(
    onFraud: (event: FraudEvent) => void
) {
    useEffect(() => {

        socket.on(
            "fraud_alert",
            (event) => {

                console.log(
                    "fraud received",
                    event
                );

                onFraud(event);
            }
        );

        return () => {
            socket.off(
                "fraud_alert"
            );
        };

    }, [onFraud]);
}