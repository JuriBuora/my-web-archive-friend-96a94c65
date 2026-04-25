import { describe, expect, it } from "vitest";
import { formatPostDate, parsePostDate } from "@/lib/postDates";

describe("parsePostDate", () => {
  it("parses YYYY-MM-DD dates without shifting the calendar day", () => {
    const parsed = parsePostDate("2026-02-05");

    expect(parsed).not.toBeNull();
    expect(parsed?.getFullYear()).toBe(2026);
    expect(parsed?.getMonth()).toBe(1);
    expect(parsed?.getDate()).toBe(5);
  });

  it("extracts the date prefix from timestamp-like values", () => {
    expect(
      formatPostDate("2026-02-05 15:11:01", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    ).toBe("Feb 5, 2026");
  });

  it("falls back to the original input when parsing fails", () => {
    expect(formatPostDate("not-a-date", { year: "numeric" })).toBe("not-a-date");
  });
});
