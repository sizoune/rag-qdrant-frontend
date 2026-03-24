import { expect, test } from "vitest";
import { cn } from "./utils";

test("cn merges classes correctly", () => {
  expect(cn("p-4", "m-2")).toBe("p-4 m-2");
  expect(cn("px-2 py-2", "p-4")).toBe("p-4");
});
