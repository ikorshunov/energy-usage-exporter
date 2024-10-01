import { TaskConfig } from "./engine/types.js";
import { TaskOperationsData } from "./types.js";
import { authToken } from "./implementations/authToken.js";
import { dataAccessToken } from "./implementations/dataAccessToken.js";
import { customerIdType } from "./implementations/customerIdType.js";
import { customerIdValue } from "./implementations/customerIdValue.js";
import { meteringPointList } from "./implementations/meteringPointList.js";

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
  "metering-point-list": {
    meteringPointList: [],
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
    implementation: customerIdType,
  },
  "customer-id-value": {
    id: "customer-id-value",
    nextOperationId: "metering-point-list",
    implementation: customerIdValue,
  },
  "metering-point-list": {
    id: "metering-point-list",
    implementation: meteringPointList,
  },
};
