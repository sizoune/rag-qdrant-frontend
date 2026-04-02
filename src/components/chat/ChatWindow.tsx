"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import { UI } from "@/lib/constants";
import type { ChatMessage } from "@/lib/types";

interface ChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onStop: () => void;
}

export default function ChatWindow({
  messages,
  isLoading,
  onSend,
  onStop,
}: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-lg font-medium font-serif text-muted-foreground">{UI.CHAT_NO_MESSAGES}</p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <ChatInput onSend={onSend} isLoading={isLoading} onStop={onStop} />
      </div>
    </div>
  );
}
