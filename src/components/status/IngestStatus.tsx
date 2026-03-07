"use client";

import { useCallback, useState } from "react";
import { IngestStatusResponse } from "@/lib/types";
import { UI } from "@/lib/constants";
import { usePolling } from "@/hooks/use-polling";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertCircle } from "lucide-react";

export default function IngestStatus() {
  const [pollingInterval, setPollingInterval] = useState(10000);

  const fetchStatus = useCallback(async (): Promise<IngestStatusResponse> => {
    const res = await fetch("/api/ingest/status");
    if (!res.ok) throw new Error(UI.COMMON_ERROR);
    const data: IngestStatusResponse = await res.json();
    setPollingInterval(data.running ? 2000 : 10000);
    return data;
  }, []);

  const { data, error, isLoading } = usePolling<IngestStatusResponse>(
    fetchStatus,
    pollingInterval,
    true
  );

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span className="text-muted-foreground">{UI.COMMON_LOADING}</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <AlertCircle className="h-6 w-6 text-destructive mr-2" />
          <span className="text-destructive">{error}</span>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {UI.STATUS_TITLE}
          {data.running ? (
            <Badge className="bg-green-500 text-white animate-pulse">
              {UI.STATUS_RUNNING}
            </Badge>
          ) : (
            <Badge variant="secondary">{UI.STATUS_IDLE}</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {data.current_task && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                {UI.STATUS_TASK}
              </dt>
              <dd className="mt-1 text-sm">{data.current_task}</dd>
            </div>
          )}
          {data.current_source && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                {UI.STATUS_SOURCE}
              </dt>
              <dd className="mt-1 text-sm break-all">{data.current_source}</dd>
            </div>
          )}
          {data.started_at && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                {UI.STATUS_STARTED}
              </dt>
              <dd className="mt-1 text-sm">{formatDate(data.started_at)}</dd>
            </div>
          )}
          {data.finished_at && (
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                {UI.STATUS_FINISHED}
              </dt>
              <dd className="mt-1 text-sm">{formatDate(data.finished_at)}</dd>
            </div>
          )}
          {data.last_message && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-muted-foreground">
                {UI.STATUS_LAST_MESSAGE}
              </dt>
              <dd className="mt-1 text-sm">{data.last_message}</dd>
            </div>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
