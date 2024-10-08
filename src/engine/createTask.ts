import readline from "readline";
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
>(initialData: OperationsData, config: TaskConfig<OperationsData>): () => void {
  const taskState: TaskState<OperationId, OperationsData> = {
    currentOperationId: getInitialOperationId(config),
    prevOperationIds: [],
    operations: null,
  };

  const taskApi: TaskApi<OperationId, OperationsData> = {
    run: () => {
      readline.emitKeypressEvents(process.stdin);
      if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
      }

      process.stdin.on("keypress", (_chunk, key) => {
        if (key.ctrl && key.name === "c") {
          process.stdout.clearScreenDown();
          process.stdout.write("\n");
          process.exit();
        }
      });

      taskApi.runOperation(taskState.currentOperationId);
    },
    runOperation: (operationId) => {
      if (!taskState.operations) {
        throw new Error("Operations have not been initialized.");
      }

      const samePrevOperationIdIndex =
        taskState.prevOperationIds.indexOf(operationId);
      if (samePrevOperationIdIndex !== -1) {
        taskState.prevOperationIds = taskState.prevOperationIds.slice(
          0,
          samePrevOperationIdIndex
        );
      }
      taskState.currentOperationId = operationId;
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
    restart: () => {
      const operations = taskState.operations;
      if (!operations) {
        throw new Error("Operations have not been initialized.");
      }
      (Object.keys(operations) as OperationId[]).forEach((operationId) => {
        operations[operationId].data = initialData[operationId];
      });
      taskState.currentOperationId = getInitialOperationId(config);
      taskState.prevOperationIds = [];

      taskApi.runOperation(taskState.currentOperationId);
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

  return taskApi.run;
}
