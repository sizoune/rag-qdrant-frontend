"use client";

import { useState, useEffect, useCallback } from "react";
import { Database, Upload, Globe, Activity, CloudUpload, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { UI } from "@/lib/constants";
import { FileListResponse, OperationResponse, SortBy, SortDir } from "@/lib/types";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { RefreshCw, Loader2 } from "lucide-react";
import FileTable from "@/components/knowledge-base/FileTable";
import UploadZone from "@/components/upload/UploadZone";
import UploadList from "@/components/upload/UploadList";
import IngestStatus from "@/components/status/IngestStatus";

const tabs = [
  { id: "kb", label: UI.NAV_KNOWLEDGE_BASE, icon: Database },
  { id: "upload", label: UI.NAV_UPLOAD, icon: Upload },
  { id: "url", label: UI.NAV_INGEST_URL, icon: Globe },
  { id: "status", label: UI.NAV_STATUS, icon: Activity },
] as const;

type TabId = (typeof tabs)[number]["id"];

function KBSection() {
  const [data, setData] = useState<FileListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isReingestingAll, setIsReingestingAll] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("last_seen");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // Debounce input pencarian; reset ke halaman 1 saat query berubah.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleSort = (column: SortBy) => {
    if (column === sortBy) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
    setPage(1);
  };

  const fetchFiles = useCallback(async () => {
    setIsFetching(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
        sort_by: sortBy,
        sort_dir: sortDir,
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/files?${params}`);
      const json: FileListResponse = await res.json();
      setData(json);
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  }, [page, pageSize, search, sortBy, sortDir]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleReingestAll = async () => {
    setIsReingestingAll(true);
    try {
      const res = await fetch("/api/files/reingest-all", { method: "POST" });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(result.message || UI.COMMON_SUCCESS);
      } else {
        toast.error(result.message || UI.COMMON_ERROR);
      }
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setIsReingestingAll(false);
      fetchFiles();
    }
  };

  const handleMigrateToS3 = async () => {
    if (!confirm(UI.KB_MIGRATE_S3_CONFIRM)) return;
    setIsMigrating(true);
    try {
      const res = await fetch("/api/uploads/migrate-to-s3", { method: "POST" });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(result.message || UI.KB_MIGRATE_S3_SUCCESS);
      } else {
        toast.error(result.message || UI.COMMON_ERROR);
      }
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{UI.KB_TITLE}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleMigrateToS3}
            disabled={isMigrating}
          >
            {isMigrating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <CloudUpload className="h-4 w-4 mr-2" />
            )}
            {UI.KB_MIGRATE_S3}
          </Button>
          <Button
            onClick={handleReingestAll}
            disabled={isReingestingAll || !data?.items.length}
          >
            {isReingestingAll ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {UI.KB_REINGEST_ALL}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={UI.KB_SEARCH_PLACEHOLDER}
            className="pl-9"
          />
        </div>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : data ? (
          <>
            <div
              className={cn(
                "transition-opacity",
                isFetching && "pointer-events-none opacity-60"
              )}
            >
              <FileTable
                files={data.items}
                onRefresh={fetchFiles}
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={handleSort}
              />
            </div>
            {data.total > 0 && (
              <div className="flex flex-col gap-3 mt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Halaman {data.page} dari {data.total_pages} ({data.total} dokumen)
                </p>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    Per halaman
                    <select
                      value={pageSize}
                      onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPage(1);
                      }}
                      disabled={isFetching}
                      className="h-7 rounded-md border border-border bg-background px-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-50"
                    >
                      {[10, 25, 50, 100].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || isFetching}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
                    disabled={page >= data.total_pages || isFetching}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

function UploadSection() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadComplete = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{UI.UPLOAD_TITLE}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <UploadZone onUploadComplete={handleUploadComplete} />
        <Separator />
        <UploadList refreshKey={refreshKey} />
      </CardContent>
    </Card>
  );
}

function URLSection() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ingest/web", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data: OperationResponse = await res.json();
      if (res.ok && data.success) {
        toast.success(
          data.added_chunks
            ? `${UI.INGEST_URL_SUCCESS}: ${data.added_chunks} chunks`
            : data.message || UI.INGEST_URL_SUCCESS
        );
        setUrl("");
      } else {
        toast.error(data.message || UI.INGEST_URL_FAILED);
      }
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          {UI.INGEST_URL_TITLE}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder={UI.INGEST_URL_PLACEHOLDER}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
            required
          />
          <Button type="submit" disabled={isLoading || !url.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {UI.INGEST_URL_START}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function StatusSection() {
  return <IngestStatus />;
}

export default function DocumentsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("kb");

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Desktop sub-sidebar */}
      <aside className="hidden md:flex w-52 flex-col border-r bg-sidebar p-3 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </aside>

      {/* Mobile tabs */}
      <div className="flex md:hidden border-b overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content area - CONDITIONAL RENDERING */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === "kb" && <KBSection />}
        {activeTab === "upload" && <UploadSection />}
        {activeTab === "url" && <URLSection />}
        {activeTab === "status" && <StatusSection />}
      </div>
    </div>
  );
}
