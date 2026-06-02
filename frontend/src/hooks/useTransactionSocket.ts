import { useEffect } from "react";
import { socket } from "../services/socket";

export function useTransactionSocket(
    onTransaction: (event: any) => void
) {
    useEffect(() => {

        socket.on(
            "transaction_created",
            (event) => {
                console.log(
                    "transaction received",
                    event
                );

                onTransaction(event);
            }
        );

        return () => {
            socket.off(
                "transaction_created"
            );
        };

    }, [onTransaction]);
}