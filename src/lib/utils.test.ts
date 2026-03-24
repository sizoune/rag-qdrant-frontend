import { expect, test } from "vitest";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Basic cn function test
const cn = (...inputs: (string | undefined | null | false)[]) => twMerge(clsx(inputs));

test("cn merges classes correctly", () => {
  expect(cn("p-4", "m-2")).toBe("p-4 m-2");
  expect(cn("px-2 py-2", "p-4")).toBe("p-4");
});
