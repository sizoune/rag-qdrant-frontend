"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { UI } from "@/lib/constants";
import type { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const isUser = message.role === "user";

  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl p-4",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-foreground"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.content ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              <p className="animate-pulse text-sm text-muted-foreground">
                {UI.CHAT_THINKING}
              </p>
            )}
          </div>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
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
              {UI.CHAT_SOURCES} ({message.sources.length})
            </button>
            {sourcesOpen && (
              <ul className="mt-1 space-y-1">
                {message.sources.map((source, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    {source}
                  </li>
                ))}
              </ul>
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
    </div>
  );
}
