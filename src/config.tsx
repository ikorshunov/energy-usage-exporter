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
    getStatus: ({ authToken }, task) => {
      const dataAccessTokenStatus =
        task.getOperationStatus("data-access-token");

      if (!authToken) {
        return "pending";
      } else if (dataAccessTokenStatus === "error") {
        return "error";
      }

      return "success";
    },
    getLabel: ({ authToken }, task) => {
      const dataAccessTokenStatus =
        task.getOperationStatus("data-access-token");

      if (authToken === undefined) {
        return "Looking for auth token...";
      }
      if (authToken === null) {
        return "Auth token not found, provide auth token:";
      }
      if (dataAccessTokenStatus === "error") {
        return "Update auth token:";
      }

      return "Auth token";
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
    getLabel: ({ dataAccessToken }) => {
      if (dataAccessToken === undefined) {
        return "Requesting data access token...";
      }
      if (dataAccessToken === null) {
        return "Failed to get data access token";
      }

      return "Data access token";
    },
  },
  "customer-id-type": {
    id: "customer-id-type",
    getStatus: (data) => {
      return "pending";
    },
    getLabel: (data) => {
      return "";
    },
  },
  "customer-id-value": {
    id: "customer-id-value",
    getStatus: (data) => {
      return "pending";
    },
    getLabel: (data) => {
      return "";
    },
  },
};
