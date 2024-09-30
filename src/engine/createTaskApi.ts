import { createOperation } from "./createOperation.js";
import { createTask } from "./createTask.js";
import {
  UnknownOperationsData,
  TaskConfig,
  TaskApi,
  Operations,
} from "./types.js";

export function createTaskApi<
  OperationsData extends UnknownOperationsData,
  OperationId extends Extract<keyof OperationsData, string>
>(
  initialData: OperationsData,
  config: TaskConfig<OperationsData>
): TaskApi<OperationId, OperationsData> {
  const task = createTask(config);

  const taskApi: TaskApi<OperationId, OperationsData> = {
    getOperationStatus: (operationId: OperationId) => {
      if (!task.operations) {
        throw new Error("Operations have not been initialized.");
      }
      return task.operations[operationId].status;
    },
  };

  const stepIds = Object.keys(config) as OperationId[];
  task.operations = stepIds.reduce((operations, operationId) => {
    const operationConfig = config[operationId];

    operations[operationId] = createOperation(
      operationConfig,
      initialData[operationId]
    );

    return operations;
  }, {} as Operations<Extract<keyof OperationsData, string>, OperationsData>);

  return taskApi;
}
