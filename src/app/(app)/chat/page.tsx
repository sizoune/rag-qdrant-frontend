"use client";

import { useCallback } from "react";
import { PanelLeftOpen } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useSessions } from "@/hooks/useSessions";
import ChatWindow from "@/components/chat/ChatWindow";
import SessionList from "@/components/chat/session-list";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function ChatPage() {
  const {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    updateSessionTitle,
  } = useSessions();

  const { messages, isLoading, sendMessage, stopGeneration, clearMessages } =
    useChat(activeSessionId);

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  const handleSend = useCallback(
    (question: string) => {
      // Update session title with first message
      const active = sessions.find((s) => s.id === activeSessionId);
      if (active && active.title === "Sesi Baru" && messages.length === 0) {
        updateSessionTitle(
          activeSessionId,
          question.substring(0, 30) + (question.length > 30 ? "..." : "")
        );
      }
      sendMessage(question);
    },
    [activeSessionId, sessions, messages.length, sendMessage, updateSessionTitle]
  );

  const handleSessionSelect = useCallback(
    (id: string) => {
      setActiveSessionId(id);
      clearMessages();
    },
    [setActiveSessionId, clearMessages]
  );

  const handleCreateSession = useCallback(() => {
    createSession();
    clearMessages();
  }, [createSession, clearMessages]);

  return (
    <div className="flex h-svh flex-col">
      {/* Top bar with session drawer trigger */}
      <div className="flex items-center gap-3 border-b px-4 py-2">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="h-8 w-8" />
            }
          >
            <PanelLeftOpen className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0" showCloseButton={false}>
            <div className="p-4">
              <SessionList
                sessions={sessions}
                activeSessionId={activeSessionId}
                onSelect={handleSessionSelect}
                onCreate={handleCreateSession}
                onDelete={deleteSession}
              />
            </div>
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium font-serif truncate">
          {activeSession?.title ?? "Chat"}
        </span>
      </div>

      {/* Full-width chat */}
      <div className="flex-1 overflow-hidden">
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSend={handleSend}
          onStop={stopGeneration}
        />
      </div>
    </div>
  );
}
