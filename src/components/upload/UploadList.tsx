"use client";

import { useState, useEffect, useCallback } from "react";
import { UploadFileItem, UploadFileListResponse } from "@/lib/types";
import { UI } from "@/lib/constants";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

interface UploadListProps {
  refreshKey: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadList({ refreshKey }: UploadListProps) {
  const [data, setData] = useState<UploadFileListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<UploadFileItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchUploads = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/uploads?page=${page}&page_size=10`);
      const json: UploadFileListResponse = await res.json();
      setData(json);
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads, refreshKey]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const uploadId = deleteTarget.upload_id;
    setDeleteTarget(null);
    setDeletingId(uploadId);
    try {
      const res = await fetch(`/api/uploads/${encodeURIComponent(uploadId)}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (res.ok && result.success) {
        toast.success(result.message || UI.COMMON_SUCCESS);
      } else {
        toast.error(result.message || UI.COMMON_ERROR);
      }
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setDeletingId(null);
      fetchUploads();
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("id-ID");
  };

  if (isLoading && !data) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
        {UI.COMMON_LOADING}
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Belum ada file yang diunggah
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama File</TableHead>
            <TableHead>Ukuran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Diubah</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item) => (
            <TableRow key={item.upload_id}>
              <TableCell className="font-medium max-w-[250px] truncate">
                {item.filename}
              </TableCell>
              <TableCell>{formatFileSize(item.size_bytes)}</TableCell>
              <TableCell>
                <Badge
                  variant={item.ingested ? "default" : "secondary"}
                >
                  {item.ingested ? "Ingested" : "Belum Ingest"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(item.modified_at)}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteTarget(item)}
                  disabled={deletingId === item.upload_id}
                >
                  {deletingId === item.upload_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span className="ml-1">{UI.UPLOAD_DELETE}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {data.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {page} / {data.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))}
            disabled={page >= data.total_pages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{UI.COMMON_CONFIRM}</DialogTitle>
            <DialogDescription>{UI.UPLOAD_CONFIRM_DELETE}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {UI.COMMON_CANCEL}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {UI.UPLOAD_DELETE}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
