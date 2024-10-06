import { getCache, sleep, writeCache } from "../utils.js";

const API_URL = "https://api.eloverblik.dk/thirdpartyapi/api";
const UI_DELAY = 1000;

export const makeApiRequest = <
  Result,
  T extends Record<string, unknown> = Record<string, unknown>
>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: T,
  headers?: RequestInit["headers"],
  transform?: (data: unknown) => Result
): Promise<Result> => {
  const url = encodeURI(`${API_URL}${endpoint}`);
  return getCache().then((cache) => {
    let cacheKey = `${method}:${url}`;
    if (method === "POST" && body) {
      cacheKey += `:${JSON.stringify(body)}`;
    }
    const cacheEntry = cache[cacheKey];
    if (cacheEntry && cacheEntry.expires > Date.now()) {
      return cacheEntry.data as Result;
    }

    return sleep(UI_DELAY).then(() => {
      return fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${process.env.ENUEX_DATA_ACCESS_TOKEN}`,
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      })
        .then((response) => {
          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              return response.json().then(({ result }) => {
                if (transform) {
                  const transformedResult = transform(result);
                  return transformedResult;
                }
                return result;
              });
            }
            return response.text();
          }

          return Promise.reject(response);
        })
        .then((data) => {
          cache[cacheKey] = {
            data,
            expires: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
          };
          writeCache(cache);

          return data;
        });
    });
  });
};
