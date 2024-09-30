import { sleep } from "../utils.js";

const API_URL = "https://api.eloverblik.dk/thirdpartyapi/api";
const UI_DELAY = 1000;

export const makeApiRequest = <T extends Record<string, unknown>>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: T,
  headers?: RequestInit["headers"]
) => {
  const url = encodeURI(`${API_URL}${endpoint}`);

  return sleep(UI_DELAY).then(() =>
    fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${process.env.ENUEX_DATA_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    }).then((response) => {
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json().then(({ result }) => result);
        }
        return response.text();
      }

      return Promise.reject(response);
    })
  );
};
