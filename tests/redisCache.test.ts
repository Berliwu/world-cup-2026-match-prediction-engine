import { afterEach, describe, expect, it } from "vitest";
import { cacheGet, cacheSet, clearMemoryCache } from "../src/utils/redisCache.js";

describe("redisCache", () => {
  afterEach(() => {
    clearMemoryCache();
    delete process.env.REDIS_URL;
    delete process.env.REDIS_HOST;
  });

  it("stores values in memory fallback", async () => {
    await cacheSet("analyze:A1", { fixtureId: "A1" }, 60);
    const v = await cacheGet<{ fixtureId: string }>("analyze:A1");
    expect(v?.fixtureId).toBe("A1");
  });
});
