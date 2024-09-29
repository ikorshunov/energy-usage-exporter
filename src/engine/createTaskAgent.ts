import { TaskAgent, TaskAgentConfig } from "./types.js";

export function createTaskAgent<
  OperationsData extends Record<string, unknown>,
  OperationId extends Extract<keyof OperationsData, string>
>(
  initialData: OperationsData,
  config: TaskAgentConfig<OperationId, OperationsData>
): TaskAgent<OperationId, OperationsData> {
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
    data: initialData,
  };
}
