import { getDataAccessToken } from "../api/getDataAccessToken.js";
import { OperationImplementationParams } from "../engine/types.js";
import { loader } from "../prompts/loader.js";
import { TaskOperationsData } from "../types.js";

export const dataAccessToken = ({
  done,
  getData,
  retry,
}: OperationImplementationParams<"data-access-token", TaskOperationsData>) => {
  const { authToken = "" } = getData("auth-token");
  const { customerIdValue } = getData("customer-id-value");
  const { meteringPointId } = getData("has-metering-point");
  const ignoreCache = Boolean(customerIdValue || meteringPointId);
  const startLoading = () => getDataAccessToken(authToken, ignoreCache);

  loader(
    {
      startLoading,
      message: (status) => {
        if (status === "pending") {
          return ignoreCache
            ? "Updating data access token"
            : "Requesting data access token";
        }
        if (status === "success") {
          return "Data access token received";
        }
        return "Failed to get data access token:";
      },
    },
    {
      clearPromptOnDone: true,
    }
  ).then(([dataAccessToken]) => {
    if (dataAccessToken) {
      process.env.ENUEX_DATA_ACCESS_TOKEN = dataAccessToken as string;
      done({ dataAccessToken: dataAccessToken as string });
    } else {
      retry("auth-token");
    }
  });
};
