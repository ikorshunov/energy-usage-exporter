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
  taskApi: TaskApi<OperationId, OperationsData>,
  config: OperationConfig<OperationId, OperationsData>,
  data: OperationsData[OperationId]
): Operation<OperationId, OperationsData> {
  return {
    id: config.id,
    data,
    get label() {
      return "label" in config
        ? config.label
        : config.getLabel(this.data, taskApi);
    },
    get status() {
      return config.getStatus(this.data, taskApi);
    },
  };
}
