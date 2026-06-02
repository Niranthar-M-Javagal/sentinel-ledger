import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import { api } from "../services/api";
import type { ActivityEvent } from "../types/activity";

export function useActivityFeed() {

    const [events, setEvents] =
        useState<ActivityEvent[]>([]);

    useEffect(() => {

        async function load() {

            const response =
                await api.get(
                    "/events/activity"
                );

            setEvents(
                response.data
            );
        }

        load();

        socket.on(
            "transaction_created",
            (data) => {

                setEvents(prev => [
                    {
                        type:
                            "TRANSFER_CREATED",
                        timestamp:
                            new Date()
                                .toISOString(),
                        data
                    },
                    ...prev
                ]);
            }
        );

        socket.on(
            "fraud_alert",
            (data) => {

                setEvents(prev => [
                    {
                        type:
                            "FRAUD_ALERT",
                        timestamp:
                            new Date()
                                .toISOString(),
                        data
                    },
                    ...prev
                ]);
            }
        );

        socket.on(
            "blacklist_updated",
            (data) => {

                setEvents(prev => [
                    {
                        type:
                            "BLACKLIST_UPDATED",
                        timestamp:
                            new Date()
                                .toISOString(),
                        data
                    },
                    ...prev
                ]);
            }
        );

        return () => {

            socket.off(
                "transaction_created"
            );

            socket.off(
                "fraud_alert"
            );

            socket.off(
                "blacklist_updated"
            );
        };

    }, []);

    return events;
}