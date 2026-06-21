import { afterEach, beforeEach, expect, test } from "vitest";
import { loadMessages, saveMessages, clearStoredMessages } from "./chat-storage";
import type { ChatMessage } from "./types";

const g = globalThis as unknown as {
  window?: object;
  localStorage?: {
    getItem(k: string): string | null;
    setItem(k: string, v: string): void;
    removeItem(k: string): void;
  };
};

function mockStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => {
      store.set(k, v);
    },
    removeItem: (k: string) => {
      store.delete(k);
    },
  };
}

beforeEach(() => {
  g.window = {};
  g.localStorage = mockStorage();
});

afterEach(() => {
  delete g.window;
  delete g.localStorage;
});

test("round-trips messages and isolates per session", () => {
  const msgs: ChatMessage[] = [{ role: "user", content: "hai" }];
  saveMessages("s1", msgs);
  expect(loadMessages("s1")).toEqual(msgs);
  expect(loadMessages("s2")).toEqual([]);
});

test("clearStoredMessages removes only its own session", () => {
  saveMessages("s1", [{ role: "user", content: "a" }]);
  saveMessages("s2", [{ role: "user", content: "b" }]);
  clearStoredMessages("s1");
  expect(loadMessages("s1")).toEqual([]);
  expect(loadMessages("s2")).toEqual([{ role: "user", content: "b" }]);
});

test("returns [] on corrupt stored JSON", () => {
  g.localStorage?.setItem("rag-chat-messages:s1", "{not valid json");
  expect(loadMessages("s1")).toEqual([]);
});
