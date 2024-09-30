import { getDataAccessToken } from "../api/getDataAccessToken.js";
import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";

export const dataAccessToken = ({
  done,
  getData,
  retry,
}: OperationImplementationParams<"data-access-token", TaskOperationsData>) => {
  console.log("Implementing data-access-token operation");
  const { authToken = "" } = getData("auth-token");
  getDataAccessToken(authToken)
    .then((dataAccessToken) => {
      process.env.ENUEX_DATA_ACCESS_TOKEN = dataAccessToken;
      done({ dataAccessToken });
    })
    .catch(() => {
      retry("auth-token");
    });
};
