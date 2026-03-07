"use client";

import { useState, useCallback } from "react";
import { usePolling } from "@/hooks/use-polling";
import { IngestStatusResponse } from "@/lib/types";
import { UI } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Loader2, X, ChevronUp } from "lucide-react";

export default function FloatingIngestStatus() {
  const [pollingInterval, setPollingInterval] = useState(10000);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const fetchStatus = useCallback(async (): Promise<IngestStatusResponse> => {
    const res = await fetch("/api/ingest/status");
    if (!res.ok) throw new Error(UI.COMMON_ERROR);
    const data: IngestStatusResponse = await res.json();
    setPollingInterval(data.running ? 2000 : 10000);
    if (data.running) setDismissed(false);
    return data;
  }, []);

  const { data } = usePolling<IngestStatusResponse>(
    fetchStatus,
    pollingInterval,
    true
  );

  if (!data?.running || dismissed) return null;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="rounded-lg border bg-background shadow-lg">
        <div
          className="flex items-center gap-2 px-3 py-2 cursor-pointer select-none"
          onClick={() => setExpanded(!expanded)}
        >
          <Loader2 className="h-4 w-4 animate-spin text-green-500 shrink-0" />
          <Badge className="bg-green-500 text-white text-xs animate-pulse">
            {UI.STATUS_RUNNING}
          </Badge>
          <span className="text-sm truncate flex-1">
            {data.current_task || UI.STATUS_TITLE}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronUp
              className={`h-4 w-4 transition-transform ${expanded ? "" : "rotate-180"}`}
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDismissed(true);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {expanded && (
          <div className="border-t px-3 py-2 space-y-1 text-sm">
            {data.current_source && (
              <div>
                <span className="text-muted-foreground">{UI.STATUS_SOURCE}: </span>
                <span className="break-all">{data.current_source}</span>
              </div>
            )}
            {data.started_at && (
              <div>
                <span className="text-muted-foreground">{UI.STATUS_STARTED}: </span>
                <span>{formatDate(data.started_at)}</span>
              </div>
            )}
            {data.last_message && (
              <div>
                <span className="text-muted-foreground">{UI.STATUS_LAST_MESSAGE}: </span>
                <span>{data.last_message}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
