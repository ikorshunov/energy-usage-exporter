import { TaskConfig } from "./engine/types.js";
import { TaskOperationsData } from "./types.js";
import { authToken } from "./implementations/authToken.js";
import { dataAccessToken } from "./implementations/dataAccessToken.js";

export const taskOperationsData: TaskOperationsData = {
  "auth-token": {
    authToken: undefined,
  },
  "data-access-token": {
    dataAccessToken: undefined,
  },
  "customer-id-type": {
    customerIdType: "customerKey",
  },
  "customer-id-value": {
    customerIdValue: undefined,
  },
};

export const taskConfig: TaskConfig<TaskOperationsData> = {
  "auth-token": {
    id: "auth-token",
    isInitial: true,
    nextOperationId: "data-access-token",
    implementation: authToken,
  },
  "data-access-token": {
    id: "data-access-token",
    nextOperationId: "customer-id-type",
    implementation: dataAccessToken,
  },
  "customer-id-type": {
    id: "customer-id-type",
    nextOperationId: "customer-id-value",
    implementation: ({ done }) => {
      console.log("Implementing customer-id-type operation");
      done({ customerIdType: "customerKey" });
    },
  },
  "customer-id-value": {
    id: "customer-id-value",
    implementation: () => {
      console.log("Implementing customer-id-value operation");
    },
  },
};
