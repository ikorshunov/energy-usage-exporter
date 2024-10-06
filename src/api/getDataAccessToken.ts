import { makeApiRequest } from "./makeApiRequest.js";

export const getDataAccessToken = (authToken: string) => {
  return makeApiRequest<string>("/token", {
    headers: { Authorization: `Bearer ${authToken}` },
  });
};
