import { useEffect, useState } from "react";
import { sleep } from "../utils.js";

export let token: string | null = null;

export const useDataAccessToken = (authToken?: string | null) => {
  const [dataAccessToken, setDataAccessToken] = useState<string | null>();

  useEffect(() => {
    if (authToken) {
      sleep(1000).then(() => {
        fetch("https://api.eloverblik.dk/thirdpartyapi/api/token", {
          headers: { Authorization: `Bearer ${authToken}` },
        }).then((response) => {
          if (response.ok) {
            response.json().then((data) => {
              token = data.result;
              setDataAccessToken(data.result);
            });
          } else {
            setDataAccessToken(null);
          }
        });
      });
    }
  }, [authToken]);

  return dataAccessToken;
};
