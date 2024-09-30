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
    getStatus: ({ authToken }) => {
      if (authToken === undefined) {
        return "pending";
      } else if (authToken === null) {
        return "error";
      }

      return "success";
    },
  },
  "data-access-token": {
    id: "data-access-token",
    getStatus: ({ dataAccessToken }) => {
      if (dataAccessToken === undefined) {
        return "pending";
      }
      if (dataAccessToken === null) {
        return "error";
      }

      return "success";
    },
  },
  "customer-id-type": {
    id: "customer-id-type",
    getStatus: (data) => {
      return "pending";
    },
  },
  "customer-id-value": {
    id: "customer-id-value",
    getStatus: (data) => {
      return "pending";
    },
  },
};
