"use client";

import { useState, useRef, useCallback } from "react";
import { UI } from "@/lib/constants";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";

type FileUploadStatus = "pending" | "uploading" | "success" | "failed";

interface UploadFileEntry {
  file: File;
  status: FileUploadStatus;
  error?: string;
}

interface UploadZoneProps {
  onUploadComplete: () => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadZone({ onUploadComplete }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadEntries, setUploadEntries] = useState<UploadFileEntry[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      const files = Array.from(fileList);
      if (files.length === 0) return;

      const entries: UploadFileEntry[] = files.map((file) => ({
        file,
        status: "pending" as FileUploadStatus,
      }));
      setUploadEntries(entries);
      setIsUploading(true);

      let allSuccess = true;
      let completedCount = 0;

      for (let i = 0; i < entries.length; i++) {
        setUploadEntries((prev) =>
          prev.map((e, idx) =>
            idx === i ? { ...e, status: "uploading" } : e
          )
        );

        try {
          const formData = new FormData();
          formData.append("file", entries[i].file);
          const res = await fetch("/api/uploads", {
            method: "POST",
            body: formData,
          });
          const data = await res.json();

          if (res.ok && data.success !== false) {
            completedCount++;
            setUploadEntries((prev) =>
              prev.map((e, idx) =>
                idx === i ? { ...e, status: "success" } : e
              )
            );
          } else {
            allSuccess = false;
            setUploadEntries((prev) =>
              prev.map((e, idx) =>
                idx === i
                  ? { ...e, status: "failed", error: data.message || UI.COMMON_ERROR }
                  : e
              )
            );
          }
        } catch {
          allSuccess = false;
          setUploadEntries((prev) =>
            prev.map((e, idx) =>
              idx === i
                ? { ...e, status: "failed", error: UI.COMMON_ERROR }
                : e
            )
          );
        }
      }

      if (allSuccess && completedCount > 0) {
        toast.success(`${completedCount} ${UI.UPLOAD_PROGRESS}`);
        try {
          const res = await fetch("/api/ingest/uploads", { method: "POST" });
          const data = await res.json();
          if (res.ok && data.success) {
            toast.success(data.message || "Ingest dimulai");
          } else {
            toast.error(data.message || "Gagal memulai ingest");
          }
        } catch {
          toast.error("Gagal memulai ingest");
        }
      } else if (!allSuccess) {
        toast.error("Beberapa file gagal diunggah. Ingest tidak dimulai.");
      }

      setIsUploading(false);
      onUploadComplete();
    },
    [onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const completedCount = uploadEntries.filter(
    (e) => e.status === "success"
  ).length;
  const totalCount = uploadEntries.length;

  const statusIcon = (status: FileUploadStatus) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium">{UI.UPLOAD_DROPZONE}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {UI.UPLOAD_SUPPORTED}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleInputChange}
          accept=".pdf,.docx,.txt,.md,.csv"
        />
      </div>

      {uploadEntries.length > 0 && (
        <div className="space-y-3">
          {isUploading && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {completedCount} dari {totalCount} {UI.UPLOAD_PROGRESS}
                </span>
              </div>
              <Progress
                value={totalCount > 0 ? (completedCount / totalCount) * 100 : 0}
              />
            </div>
          )}
          <div className="space-y-2">
            {uploadEntries.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-md border p-3 text-sm"
              >
                {statusIcon(entry.status)}
                <span className="flex-1 truncate">{entry.file.name}</span>
                <Badge variant="outline">{formatFileSize(entry.file.size)}</Badge>
                {entry.error && (
                  <span className="text-xs text-destructive">{entry.error}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
