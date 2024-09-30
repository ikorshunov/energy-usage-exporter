import { createOperation } from "./createOperation.js";
import { getInitialOperationId } from "./utils.js";
import {
  UnknownOperationsData,
  TaskConfig,
  TaskApi,
  Operations,
  TaskState,
} from "./types.js";

export function createTask<
  OperationsData extends UnknownOperationsData,
  OperationId extends Extract<keyof OperationsData, string>
>(
  initialData: OperationsData,
  config: TaskConfig<OperationsData>
): TaskApi<OperationId, OperationsData> {
  const taskState: TaskState<OperationId, OperationsData> = {
    currentOperationId: getInitialOperationId(config),
    prevOperationIds: [],
    operations: null,
  };

  const taskApi: TaskApi<OperationId, OperationsData> = {
    run: () => {
      taskApi.runOperation(taskState.currentOperationId);
    },
    runOperation: (operationId) => {
      if (!taskState.operations) {
        throw new Error("Operations have not been initialized.");
      }
      const prevOperationsId = taskState.currentOperationId;
      taskState.currentOperationId = operationId;

      if (operationId !== prevOperationsId) {
        taskState.prevOperationIds.push(prevOperationsId);
      }

      taskState.operations[operationId].run();
    },
    getOperationData: (operationId) => {
      if (!taskState.operations) {
        throw new Error("Operations have not been initialized.");
      }
      return taskState.operations[operationId].data;
    },
    setOperationData: (operationId, data) => {
      if (!taskState.operations) {
        throw new Error("Operations have not been initialized.");
      }
      taskState.operations[operationId].data = {
        ...taskState.operations[operationId].data,
        ...data,
      };
    },
  };

  const stepIds = Object.keys(config) as OperationId[];
  taskState.operations = stepIds.reduce((operations, operationId) => {
    const operationConfig = config[operationId];

    operations[operationId] = createOperation(
      operationConfig,
      initialData[operationId],
      taskApi
    );

    return operations;
  }, {} as Operations<Extract<keyof OperationsData, string>, OperationsData>);

  return taskApi;
}
