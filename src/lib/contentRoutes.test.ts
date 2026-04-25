import { describe, expect, it } from "vitest";
import { collectionLabel, collectionPath, normalizeCollectionSlug } from "@/lib/contentRoutes";

describe("normalizeCollectionSlug", () => {
  it("accepts blog aliases", () => {
    expect(normalizeCollectionSlug("blog")).toBe("blog");
    expect(normalizeCollectionSlug("Blog")).toBe("blog");
    expect(normalizeCollectionSlug("blogs")).toBe("blog");
  });

  it("accepts lab aliases", () => {
    expect(normalizeCollectionSlug("lab")).toBe("lab");
    expect(normalizeCollectionSlug("Lab")).toBe("lab");
    expect(normalizeCollectionSlug("Labs")).toBe("lab");
  });

  it("rejects unknown slugs", () => {
    expect(normalizeCollectionSlug("notes")).toBeNull();
    expect(normalizeCollectionSlug(undefined)).toBeNull();
  });
});

describe("collection helpers", () => {
  it("returns stable labels and canonical paths", () => {
    expect(collectionPath("blog")).toBe("/blog");
    expect(collectionPath("lab")).toBe("/labs");
    expect(collectionLabel("blog")).toBe("Blog");
    expect(collectionLabel("lab")).toBe("Labs");
  });
});
