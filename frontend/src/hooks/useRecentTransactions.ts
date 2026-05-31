import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { TransactionEvent } from "../types/events";

export function useRecentTransactions() {
    const [transactions, setTransactions] =
        useState<TransactionEvent[]>([]);

    useEffect(() => {
        async function load() {
            const response =
                await api.get(
                    "/events/recent-transactions"
                );

            setTransactions(response.data);
        }

        load();
    }, []);

    return transactions;
}