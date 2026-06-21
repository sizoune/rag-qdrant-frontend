"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  FileText,
  Globe,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UI } from "@/lib/constants";
import type { ChatMessage, LocationItem, SourceItem } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

function isWebSource(source: SourceItem): boolean {
  return (
    source.source_type === "web" ||
    source.source.startsWith("http://") ||
    source.source.startsWith("https://")
  );
}

function buildDeepLink(
  sourceItem: SourceItem,
  location: LocationItem
): string | null {
  if (isWebSource(sourceItem)) {
    if (location.url_fragment) {
      return `${sourceItem.source}#${location.url_fragment}`;
    }
    return sourceItem.source;
  }
  // Local PDF — surface only when running in environments that can resolve it.
  // Browsers cannot open local file paths in production; safe fallback: no link.
  return null;
}

function SourceBlock({ source }: { source: SourceItem }) {
  const label = source.filename || source.source;
  const Icon = isWebSource(source) ? Globe : FileText;
  const totalLocations = source.locations.length;

  return (
    <div className="rounded-md border border-border/60 bg-muted/30 p-2">
      <div className="flex items-center gap-2 text-xs font-medium">
        <Icon className="size-3 shrink-0 text-muted-foreground" />
        {isWebSource(source) ? (
          <a
            href={source.source}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-foreground hover:underline"
            title={source.source}
          >
            {label}
          </a>
        ) : (
          <span className="truncate text-foreground" title={source.source}>
            {label}
          </span>
        )}
        {totalLocations > 1 && (
          <span className="ml-auto text-[10px] text-muted-foreground">
            {totalLocations} bagian
          </span>
        )}
      </div>

      <ul className="mt-2 space-y-2">
        {source.locations.map((loc, i) => {
          const link = buildDeepLink(source, loc);
          return (
            <li key={i} className="text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="font-medium text-foreground">
                  {loc.display}
                </span>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground"
                    title="Buka sumber"
                  >
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
              {loc.chunk_preview && (
                <p className="mt-0.5 line-clamp-3 text-muted-foreground">
                  &ldquo;{loc.chunk_preview}&rdquo;
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function formatTime(ts?: number): string | null {
  if (!ts) return null;
  // Sertakan detik: waktu kirim & waktu jawaban sering jatuh di menit yang sama,
  // jadi tanpa detik keduanya terlihat identik (mis. "23.51" vs "23.51").
  return new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatDuration(ms?: number): string | null {
  if (ms == null) return null;
  if (ms < 1000) return `${ms} ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1).replace(".", ",")} dtk`;
  const mins = Math.floor(seconds / 60);
  const rem = Math.round(seconds % 60);
  return `${mins} mnt ${rem} dtk`;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const isUser = message.role === "user";
  const sources = message.sources ?? [];
  const timeLabel = formatTime(message.createdAt);
  const durationLabel = isUser ? null : formatDuration(message.durationMs);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1",
        isUser ? "items-end" : "items-start"
      )}
    >
      <div
        className={cn(
          isUser
            ? "max-w-[85%] rounded-2xl bg-secondary px-4 py-2.5 text-secondary-foreground"
            : "w-full text-foreground"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-medium">
            {message.content ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              <p className="animate-pulse text-sm text-muted-foreground">
                {UI.CHAT_THINKING}
              </p>
            )}
          </div>
        )}

        {!isUser && sources.length > 0 && (
          <div className="mt-3 border-t pt-3">
            <button
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {sourcesOpen ? (
                <ChevronDown className="size-3" />
              ) : (
                <ChevronRight className="size-3" />
              )}
              {UI.CHAT_SOURCES} ({sources.length})
            </button>
            {sourcesOpen && (
              <div className="mt-2 space-y-2">
                {sources.map((source, i) => (
                  <SourceBlock key={`${source.source}-${i}`} source={source} />
                ))}
              </div>
            )}
          </div>
        )}

        {!isUser && message.token_usage && (
          <div className="mt-2 flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-[10px]">
              {UI.CHAT_TOTAL_TOKENS}: {message.token_usage.total_estimate}
            </Badge>
          </div>
        )}
      </div>

      {(timeLabel || durationLabel) && (
        <div className="px-1 text-[11px] tabular-nums text-muted-foreground">
          {timeLabel}
          {durationLabel && <span> · {durationLabel}</span>}
        </div>
      )}
    </div>
  );
}
