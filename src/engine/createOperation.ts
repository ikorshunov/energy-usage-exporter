import {
  Operation,
  OperationConfig,
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
  return {
    id: config.id,
    data,
    run: () => config.implementation(),
    get status() {
      return config.getStatus(this.data);
    },
  };
}
