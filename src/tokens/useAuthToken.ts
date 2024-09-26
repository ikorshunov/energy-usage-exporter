import { useCallback, useEffect, useState } from "react";
import fs from "fs";
import { sleep } from "../utils.js";

const AUTH_TOKEN_FILE_PATH = `${import.meta.dirname}/auth-token.txt`;

export const useAuthToken = () => {
  const [token, setToken] = useState<string | null>();

  useEffect(() => {
    let isMounted = true;

    fs.readFile(AUTH_TOKEN_FILE_PATH, "utf-8", async (err, data) => {
      if (!isMounted) return;
      await sleep(1000);
      if (err) {
        setToken(null);
      } else {
        setToken(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const saveToken = useCallback((token: string) => {
    fs.writeFile(AUTH_TOKEN_FILE_PATH, token, (err) => {
      if (err) {
        console.error(err);
      } else {
        setToken(token);
      }
    });
  }, []);

  return [token, saveToken] as const;
};
