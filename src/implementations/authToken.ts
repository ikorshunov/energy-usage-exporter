import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";
import { password } from "@inquirer/prompts";
import { getCache, writeCache } from "../utils.js";

export const authToken = ({
  done,
  getData,
}: OperationImplementationParams<"auth-token", TaskOperationsData>) => {
  getCache().then((cache) => {
    const cachedAuthToken = cache["auth-token"]?.data as string;
    const { authToken } = getData();
    if (!cachedAuthToken || authToken) {
      password({
        message: !authToken
          ? "Enter your auth token:"
          : "Invalid auth token. Update your auth token:",
      }).then((authToken) => {
        done({ authToken });
        cache["auth-token"] = {
          data: authToken,
          expires: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
        };
        writeCache(cache);
      });
    } else {
      done({ authToken: cachedAuthToken });
    }
  });
};
