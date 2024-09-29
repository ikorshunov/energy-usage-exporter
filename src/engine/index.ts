import {
  Operations,
  UnknownOperationsData,
  Task,
  TaskConfig,
  TaskApi,
} from "./types.js";

function createTask<
  OperationsData extends UnknownOperationsData,
  OperationId extends Extract<keyof OperationsData, string>
>(config: TaskConfig<OperationsData>): Task<OperationId, OperationsData> {
  const stepIds = Object.keys(config) as OperationId[];
  const initialOperationIds = stepIds.filter((key) => config[key].isInitial);
  let initialOperationId: OperationId;
  if (initialOperationIds.length === 0) {
    console.warn("No initial step found, using first step as initial step");
    initialOperationId = stepIds[0];
  } else {
    if (initialOperationIds.length > 1) {
      console.warn("Multiple initial steps found, using the first one");
    }
    initialOperationId = initialOperationIds[0];
  }

  return {
    config,
    currentOperationId: initialOperationId,
    prevOperationIds: [],
    operations: null,
  };
}

export function createTaskApi<
  OperationsData extends UnknownOperationsData,
  OperationId extends Extract<keyof OperationsData, string>
>(
  initialData: OperationsData,
  config: TaskConfig<OperationsData>
): TaskApi<OperationId, OperationsData> {
  const task = createTask(config);

  const taskApi: TaskApi<OperationId, OperationsData> = {
    getOperation: <ExactOperationId extends OperationId>(
      operationId: ExactOperationId
    ) => {
      if (!task.operations) {
        throw new Error("Operations have not been initialized.");
      }
      return task.operations[operationId];
    },
  };

  const stepIds = Object.keys(config) as OperationId[];
  task.operations = stepIds.reduce((operations, operationId) => {
    const operationConfig = config[operationId];

    operations[operationId] = {
      id: operationId,
      data: initialData[operationId],
      get label() {
        return "label" in operationConfig
          ? operationConfig.label
          : operationConfig.getLabel(this.data, taskApi);
      },
      get status() {
        return operationConfig.getStatus(this.data, taskApi);
      },
    };

    return operations;
  }, {} as Operations<Extract<keyof OperationsData, string>, OperationsData>);

  return taskApi;
}
