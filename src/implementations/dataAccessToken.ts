import { getDataAccessToken } from "../api/getDataAccessToken.js";
import { OperationImplementationParams } from "../engine/types.js";
import { apiRequest } from "../prompts/apiRequest.js";
import { TaskOperationsData } from "../types.js";

export const dataAccessToken = ({
  done,
  getData,
  retry,
}: OperationImplementationParams<"data-access-token", TaskOperationsData>) => {
  const { authToken = "" } = getData("auth-token");
  const startRequest = () => getDataAccessToken(authToken);

  apiRequest({
    startRequest,
    message: (status) => {
      if (status === "pending") {
        return "Requesting data access token";
      }
      if (status === "success") {
        return "Data access token received";
      }
      return "Failed to get data access token:";
    },
  }).then((dataAccessToken) => {
    if (dataAccessToken) {
      process.env.ENUEX_DATA_ACCESS_TOKEN = dataAccessToken as string;
      done({ dataAccessToken: dataAccessToken as string });
    } else {
      retry("auth-token");
    }
  });
};
