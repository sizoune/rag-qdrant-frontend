"use client";

import { useCallback, useState } from "react";
import { IngestStatusResponse } from "@/lib/types";
import { usePolling } from "@/hooks/use-polling";

export function useIngestStatus() {
  const [pollingInterval, setPollingInterval] = useState(10000);

  const fetchStatus = useCallback(async (): Promise<IngestStatusResponse> => {
    const res = await fetch("/api/ingest/status");
    if (!res.ok) throw new Error("Failed to fetch ingest status");
    const data: IngestStatusResponse = await res.json();
    setPollingInterval(data.running ? 2000 : 10000);
    return data;
  }, []);

  const { data, error, isLoading, refetch } =
    usePolling<IngestStatusResponse>(fetchStatus, pollingInterval, true);

  return { data, error, isLoading, refetch };
}
