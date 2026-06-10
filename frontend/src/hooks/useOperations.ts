import { useEffect, useState } from "react";
import { getOperationsMetrics } from "../services/api";

export function useOperations() {

    const [metrics, setMetrics] =
        useState<any>(null);

    const load = async () => {
        const data =
            await getOperationsMetrics();

        setMetrics(data);
    };

    useEffect(() => {
        load();

        const interval =
            setInterval(load, 5000);

        return () => clearInterval(interval);

    }, []);

    return metrics;
}