import {
  Operation,
  OperationConfig,
  OperationImplementationParams,
  TaskApi,
  UnknownOperationsData,
} from "./types.js";

export function createOperation<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
>(
  config: OperationConfig<OperationId, OperationsData>,
  data: OperationsData[OperationId],
  taskApi: TaskApi<OperationId, OperationsData>
): Operation<OperationId, OperationsData> {
  const implementationParams: OperationImplementationParams<
    OperationId,
    OperationsData
  > = {
    getData: (operationId?: OperationId) => {
      if (!operationId) {
        return taskApi.getOperationData(config.id);
      }
      return taskApi.getOperationData(operationId);
    },
    done: (data) => {
      let operationData: OperationsData[OperationId];
      if (typeof data === "function") {
        const prevData = taskApi.getOperationData(config.id);
        operationData = data(prevData);
      } else {
        operationData = data;
      }
      taskApi.setOperationData(config.id, operationData);

      if (config.nextOperationId) {
        const nextOperationId =
          typeof config.nextOperationId === "function"
            ? config.nextOperationId(operationData)
            : config.nextOperationId;
        taskApi.runOperation(nextOperationId as unknown as OperationId);
      } else {
        process.exit(0);
      }
    },
    retry: (operationId?: OperationId) => {
      taskApi.runOperation(operationId || config.id);
    },
  };

  return {
    id: config.id,
    data,
    run: () => config.implementation(implementationParams),
  };
}
