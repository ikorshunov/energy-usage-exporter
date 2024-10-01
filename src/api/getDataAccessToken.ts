import { makeApiRequest } from "./makeApiRequest.js";

export const getDataAccessToken = (authToken: string) => {
  return makeApiRequest<string>("/token", "GET", undefined, {
    Authorization: `Bearer ${authToken}`,
  });
};
