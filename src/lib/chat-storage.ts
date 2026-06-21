import type { ChatMessage } from "@/lib/types";

// Per-session chat history lives in localStorage — the backend keeps history
// only in-memory for retrieval context and exposes no endpoint to read it back.
const PREFIX = "rag-chat-messages:";

export function loadMessages(sessionId: string): ChatMessage[] {
  if (typeof window === "undefined" || !sessionId) return [];
  try {
    const raw = localStorage.getItem(PREFIX + sessionId);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
}

export function saveMessages(sessionId: string, messages: ChatMessage[]): void {
  if (typeof window === "undefined" || !sessionId) return;
  try {
    // ponytail: no size cap; saveMessages swallows quota errors so the app keeps
    // working if a heavy session ever exceeds the localStorage budget.
    localStorage.setItem(PREFIX + sessionId, JSON.stringify(messages));
  } catch {
    // Best-effort persistence — ignore quota/serialization failures.
  }
}

export function clearStoredMessages(sessionId: string): void {
  if (typeof window === "undefined" || !sessionId) return;
  localStorage.removeItem(PREFIX + sessionId);
}
