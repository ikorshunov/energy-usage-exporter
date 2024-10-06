import path from "path";
import fs from "fs/promises";
import fsSync, { write } from "fs";
import { Cache } from "./types.js";

const cacheFilePath = path.resolve(import.meta.dirname, "cache.json");

export function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export const writeCache = (cache: Cache) => {
  try {
    fsSync.writeFileSync(cacheFilePath, JSON.stringify(cache));
  } catch (e) {
    console.error("Failed to write cache file", e);
  }
};

export const getCache = (): Promise<Cache> => {
  return fs
    .readFile(cacheFilePath, "utf8")
    .then((data) => {
      const cache = JSON.parse(data);
      return cache;
    })
    .catch(() => {
      writeCache({});
      return {};
    });
};
