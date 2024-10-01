import { readFile, writeFile } from "fs";
import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";
import { password } from "@inquirer/prompts";

export const authToken = ({
  done,
  getData,
}: OperationImplementationParams<"auth-token", TaskOperationsData>) => {
  const tokenFileName = `${import.meta.dirname}/auth_token.txt`;
  readFile(tokenFileName, "utf8", (err, data) => {
    const { authToken } = getData();
    if (err || authToken) {
      password({
        message: !authToken
          ? "Enter your auth token:"
          : "Invalid auth token. Update your auth token:",
      }).then((authToken) => {
        done({ authToken });
        writeFile(tokenFileName, authToken, (err) => {
          if (err) {
            console.error("Failed to save auth token to file.");
          }
        });
      });
    } else {
      done({ authToken: data });
    }
  });
};
