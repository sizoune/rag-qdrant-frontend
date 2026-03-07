"use client";

import { useState, useEffect, useCallback } from "react";

interface Session {
  id: string;
  title: string;
  created_at: string;
}

function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

const STORAGE_KEY = "rag-chat-sessions";

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: Session[] = JSON.parse(stored);
      setSessions(parsed);
      if (parsed.length > 0) {
        setActiveSessionId(parsed[0].id);
      }
    }
    if (!stored || JSON.parse(stored).length === 0) {
      const newSession: Session = {
        id: generateId(),
        title: "Sesi Baru",
        created_at: new Date().toISOString(),
      };
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newSession]));
    }
  }, []);

  const saveToStorage = useCallback((updated: Session[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  const createSession = useCallback(() => {
    const newSession: Session = {
      id: generateId(),
      title: "Sesi Baru",
      created_at: new Date().toISOString(),
    };
    setSessions((prev) => {
      const updated = [newSession, ...prev];
      saveToStorage(updated);
      return updated;
    });
    setActiveSessionId(newSession.id);
    return newSession.id;
  }, [saveToStorage]);

  const deleteSession = useCallback(
    (id: string) => {
      setSessions((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        saveToStorage(updated);
        if (id === activeSessionId && updated.length > 0) {
          setActiveSessionId(updated[0].id);
        }
        return updated;
      });
    },
    [activeSessionId, saveToStorage]
  );

  const updateSessionTitle = useCallback(
    (id: string, title: string) => {
      setSessions((prev) => {
        const updated = prev.map((s) =>
          s.id === id ? { ...s, title } : s
        );
        saveToStorage(updated);
        return updated;
      });
    },
    [saveToStorage]
  );

  return {
    sessions,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    updateSessionTitle,
  };
}
