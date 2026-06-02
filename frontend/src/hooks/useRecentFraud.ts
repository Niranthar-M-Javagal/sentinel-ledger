import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { FraudEvent } from "../types/fraud";

export function useRecentFraud() {

    const [fraudEvents, setFraudEvents] =
        useState<FraudEvent[]>([]);

    useEffect(() => {

        async function load() {

            const response =
                await api.get(
                    "/fraud-events"
                );

            setFraudEvents(response.data);
        }

        load();

    }, []);

    function addFraudEvent(
        event: FraudEvent
    ) {
        setFraudEvents(prev => [
            event,
            ...prev
        ]);
    }

    return {
        fraudEvents,
        addFraudEvent
    };
}