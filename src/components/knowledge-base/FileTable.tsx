"use client";

import { useState } from "react";
import { FileItem, SortBy, SortDir } from "@/lib/types";
import { UI } from "@/lib/constants";
import { cn } from "@/lib/utils";
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
import { Trash2, RefreshCw, Loader2, Cloud, CloudOff, ArrowUp, ArrowDown } from "lucide-react";

interface FileTableProps {
  files: FileItem[];
  onRefresh: () => void;
  sortBy: SortBy;
  sortDir: SortDir;
  onSort: (column: SortBy) => void;
}

export default function FileTable({ files, onRefresh, sortBy, sortDir, onSort }: FileTableProps) {
  const [deleteTarget, setDeleteTarget] = useState<FileItem | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const sourceId = deleteTarget.source_id;
    setLoadingAction(`delete-${sourceId}`);
    setDeleteTarget(null);
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(sourceId)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || UI.COMMON_SUCCESS);
      } else {
        toast.error(data.message || UI.COMMON_ERROR);
      }
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setLoadingAction(null);
      onRefresh();
    }
  };

  const handleReingest = async (sourceId: string) => {
    setLoadingAction(`reingest-${sourceId}`);
    try {
      const res = await fetch(`/api/files/${encodeURIComponent(sourceId)}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || UI.COMMON_SUCCESS);
      } else {
        toast.error(data.message || UI.COMMON_ERROR);
      }
    } catch {
      toast.error(UI.COMMON_ERROR);
    } finally {
      setLoadingAction(null);
      onRefresh();
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID");
  };

  const SortableHead = ({
    column,
    label,
    align,
  }: {
    column: SortBy;
    label: string;
    align?: "right";
  }) => (
    <TableHead className={align === "right" ? "text-right" : undefined}>
      <button
        type="button"
        onClick={() => onSort(column)}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground transition-colors",
          align === "right" && "flex-row-reverse",
          sortBy === column ? "text-foreground" : "text-muted-foreground"
        )}
      >
        {label}
        {sortBy === column &&
          (sortDir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          ))}
      </button>
    </TableHead>
  );

  if (files.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {UI.KB_EMPTY}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableHead column="filename" label={UI.KB_SOURCE} />
            <SortableHead column="source_type" label={UI.KB_TYPE} />
            <SortableHead column="chunk_count" label={UI.KB_CHUNKS} align="right" />
            <SortableHead column="last_seen" label={UI.KB_LAST_SEEN} />
            <TableHead className="text-center">{UI.KB_S3_STATUS}</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.source_id}>
              <TableCell className="font-medium max-w-[300px] truncate">
                {file.source}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{file.source_type}</Badge>
              </TableCell>
              <TableCell className="text-right">{file.chunk_count}</TableCell>
              <TableCell>{formatDate(file.last_seen)}</TableCell>
              <TableCell className="text-center">
                {file.in_s3 ? (
                  <Badge variant="default" className="gap-1">
                    <Cloud className="h-3 w-3" />
                    {UI.KB_IN_S3}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1 text-muted-foreground">
                    <CloudOff className="h-3 w-3" />
                    {UI.KB_NOT_IN_S3}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReingest(file.source_id)}
                    disabled={loadingAction === `reingest-${file.source_id}`}
                  >
                    {loadingAction === `reingest-${file.source_id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-1">{UI.KB_REINGEST}</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTarget(file)}
                    disabled={loadingAction === `delete-${file.source_id}`}
                  >
                    {loadingAction === `delete-${file.source_id}` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="ml-1">{UI.KB_DELETE}</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{UI.COMMON_CONFIRM}</DialogTitle>
            <DialogDescription>{UI.KB_CONFIRM_DELETE}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              {UI.COMMON_CANCEL}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {UI.KB_DELETE}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
