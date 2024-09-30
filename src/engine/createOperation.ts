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
  data: OperationsData[OperationId]
): Operation<OperationId, OperationsData> {
  return {
    id: config.id,
    data,
    get status() {
      return config.getStatus(this.data);
    },
  };
}
