import path from "path";
import fs from "fs/promises";
import { Cache } from "./types.js";
import { KeypressEvent } from "@inquirer/core";

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
