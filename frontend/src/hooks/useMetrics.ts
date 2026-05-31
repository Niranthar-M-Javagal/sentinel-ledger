import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Metrics } from "../types/metrics";

export function useMetrics() {
  const [metrics, setMetrics] =
    useState<Metrics | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      const response =
        await api.get("/dashboard/metrics");

      setMetrics(response.data);
    }

    loadMetrics();
  }, []);

  return metrics;
}