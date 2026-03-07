"use client";

import { useState, useRef, useCallback } from "react";
import { Send, Square } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { UI } from "@/lib/constants";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export default function ChatInput({ onSend, isLoading, onStop }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend(trimmed);
    setValue("");
    textareaRef.current?.focus();
  }, [value, isLoading, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mx-4 mb-4 rounded-2xl border bg-card shadow-lg p-3">
      <div className="flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={UI.CHAT_PLACEHOLDER}
          disabled={isLoading}
          className="min-h-10 max-h-40 resize-none border-0 shadow-none focus-visible:ring-0"
          rows={1}
        />
        {isLoading ? (
          <Button
            variant="destructive"
            size="icon"
            onClick={onStop}
            aria-label="Stop"
          >
            <Square className="size-4" />
          </Button>
        ) : (
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!value.trim()}
            aria-label={UI.CHAT_SEND}
          >
            <Send className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
