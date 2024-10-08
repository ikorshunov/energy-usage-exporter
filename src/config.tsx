import path from "path";
import { TaskConfig } from "./engine/types.js";
import { AggregatedMeteringPointsData, TaskOperationsData } from "./types.js";
import { authToken } from "./implementations/authToken.js";
import { dataAccessToken } from "./implementations/dataAccessToken.js";
import { customerIdType } from "./implementations/customerIdType.js";
import { customerIdValue } from "./implementations/customerIdValue.js";
import { meteringPoints } from "./implementations/meteringPoints.js";
import { selectedMeteringPoints } from "./implementations/selectedMeteringPoints.js";
import { exportParams } from "./implementations/exportParams.js";
import { exportData } from "./implementations/exportData.js";

export const cacheFilePath = path.resolve(`${import.meta.url}/cache`);

export const getInitialAggregatedMeteringPointsData: () => AggregatedMeteringPointsData =
  () => ({
    totalStreets: 0,
    totalBuildings: 0,
    data: {},
  });

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
  "metering-points": {
    meteringPoints: getInitialAggregatedMeteringPointsData(),
  },
  "selected-metering-points": {
    meteringPointIds: [],
  },
  "export-params": {
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    timeAggregation: "Hour",
  },
  "export-data": {
    exportData: {},
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
    nextOperationId: "metering-points",
    implementation: customerIdValue,
  },
  "metering-points": {
    id: "metering-points",
    nextOperationId: "selected-metering-points",
    implementation: meteringPoints,
  },
  "selected-metering-points": {
    id: "selected-metering-points",
    nextOperationId: "export-params",
    implementation: selectedMeteringPoints,
  },
  "export-params": {
    id: "export-params",
    nextOperationId: "export-data",
    implementation: exportParams,
  },
  "export-data": {
    id: "export-data",
    implementation: exportData,
  },
};
