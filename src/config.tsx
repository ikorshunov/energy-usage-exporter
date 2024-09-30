import { TaskConfig } from "./engine/types.js";
import { TaskOperationsData } from "./types.js";

export const taskOperationsData: TaskOperationsData = {
  "data-access-token": {
    authToken: undefined,
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
  "data-access-token": {
    id: "data-access-token",
    isInitial: true,
    getStatus: ({ dataAccessToken }) => {
      if (dataAccessToken === undefined) {
        return "pending";
      }
      if (dataAccessToken === null) {
        return "error";
      }

      return "success";
    },
    implementation: () => {
      console.log("Implementing data-access-token operation");
    },
  },
  "customer-id-type": {
    id: "customer-id-type",
    getStatus: (data) => {
      return "pending";
    },
    implementation: () => {
      console.log("Implementing customer-id-type operation");
    },
  },
  "customer-id-value": {
    id: "customer-id-value",
    getStatus: (data) => {
      return "pending";
    },
    implementation: () => {
      console.log("Implementing customer-id-value operation");
    },
  },
};
