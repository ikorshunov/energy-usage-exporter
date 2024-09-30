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
      if (typeof data === "function") {
        const prevData = taskApi.getOperationData(config.id);
        taskApi.setOperationData(config.id, data(prevData));
      } else {
        taskApi.setOperationData(config.id, data);
      }

      if (config.nextOperationId) {
        taskApi.runOperation(config.nextOperationId as unknown as OperationId);
      }
    },
    retry: (operationId) => {
      taskApi.runOperation(operationId || config.id);
    },
  };

  return {
    id: config.id,
    data,
    run: () => config.implementation(implementationParams),
  };
}
