import { makeApiRequest } from "./makeApiRequest.js";

export const getDataAccessToken = (authToken: string, ignoreCache: boolean) => {
  return makeApiRequest<string>("/token", {
    headers: { Authorization: `Bearer ${authToken}` },
    ignoreCache,
  });
};
