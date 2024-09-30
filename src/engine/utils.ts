import { TaskConfig, UnknownOperationsData } from "./types.js";

export const getInitialOperationId = <
  OperationsData extends UnknownOperationsData,
  OperationId extends Extract<keyof OperationsData, string>
>(
  config: TaskConfig<OperationsData>
): OperationId => {
  const stepIds = Object.keys(config) as OperationId[];
  const initialOperationIds = stepIds.filter((key) => config[key].isInitial);
  let initialOperationId;
  if (initialOperationIds.length === 0) {
    console.warn("No initial step found, using first step as initial step");
    initialOperationId = stepIds[0];
  } else {
    if (initialOperationIds.length > 1) {
      console.warn("Multiple initial steps found, using the first one");
    }
    initialOperationId = initialOperationIds[0];
  }

  return initialOperationId;
};
