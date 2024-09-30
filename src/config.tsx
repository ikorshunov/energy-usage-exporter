import { TaskConfig } from "./engine/types.js";
import { TaskOperationsData } from "./types.js";

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
    customerIdValue: null,
  },
};

export const taskConfig: TaskConfig<TaskOperationsData> = {
  "auth-token": {
    id: "auth-token",
    isInitial: true,
    nextOperationId: "data-access-token",
    implementation: ({ done }) => {
      console.log("Implementing auth-token operation");
      done({ authToken: "authToken" });
    },
  },
  "data-access-token": {
    id: "data-access-token",
    nextOperationId: "customer-id-type",
    implementation: ({ done }) => {
      console.log("Implementing data-access-token operation");
      done({ dataAccessToken: "dataAccessToken" });
    },
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
