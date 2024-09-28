import { useEffect, useState } from "react";
import { getDataAccessToken } from "../api/getDataAccessToken.js";

export let token: string | null = null;

export const useDataAccessToken = (authToken?: string | null) => {
  const [dataAccessToken, setDataAccessToken] = useState<string | null>();

  useEffect(() => {
    if (authToken) {
      getDataAccessToken(authToken)
        .then((accessToken) => {
          token = accessToken;
          setDataAccessToken(accessToken);
        })
        .catch(() => {
          token = null;
          setDataAccessToken(null);
        });
    }
  }, [authToken]);

  return dataAccessToken;
};
