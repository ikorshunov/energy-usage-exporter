import path from "path";
import fs from "fs/promises";
import { Cache } from "./types.js";

const cacheFilePath = path.resolve(import.meta.dirname, "cache.json");

export function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export const writeCache = (cache: Cache) => {
  return fs.writeFile(cacheFilePath, JSON.stringify(cache));
};

export const getCache = (): Promise<Cache> => {
  return fs
    .readFile(cacheFilePath, "utf8")
    .catch(() => {
      return writeCache({}).then(() => {
        return "{}";
      });
    })
    .then((data) => {
      const cache = JSON.parse(data);
      return cache;
    });
};

export const getStringDateArr = (dateArr: [number, number, number]) => {
  return dateArr.map((entry, index) => {
    let stringEntry = entry.toString();
    if (stringEntry.length === 1 && (index === 1 || index === 2)) {
      stringEntry = `0${stringEntry}`;
    } else if (index === 0 && stringEntry.length < 4) {
      stringEntry = "0".repeat(4 - stringEntry.length) + stringEntry;
    }
    return stringEntry;
  });
};
