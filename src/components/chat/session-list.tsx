"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UI } from "@/lib/constants";

interface Session {
  id: string;
  title: string;
  created_at: string;
}

interface SessionListProps {
  sessions: Session[];
  activeSessionId: string;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
}

export default function SessionList({
  sessions,
  activeSessionId,
  onSelect,
  onCreate,
  onDelete,
}: SessionListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={onCreate}
        >
          <Plus className="size-4" />
          {UI.CHAT_NEW_SESSION}
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-muted",
              session.id === activeSessionId && "bg-muted font-medium"
            )}
            onClick={() => onSelect(session.id)}
          >
            <span className="truncate">{session.title}</span>
            <Button
              variant="ghost"
              size="icon-xs"
              className="shrink-0 opacity-0 group-hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
