export type OperationStatus = "pending" | "success" | "error";

export type UnknownOperationsData = Record<string, Record<string, unknown>>;

type GetOperationStatus<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  (data: OperationsData[OperationId]): OperationStatus;
};

export type OperationConfig<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  id: OperationId;
  isInitial?: boolean;
  getStatus: GetOperationStatus<OperationId, OperationsData>;
  implementation: VoidFunction;
};

export type Operation<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  readonly id: OperationId;
  readonly status: OperationStatus;
  readonly run: VoidFunction;
  data: OperationsData[OperationId];
};

export type Operations<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  [Key in OperationId]: Operation<Key, OperationsData>;
};

export type TaskConfig<
  OperationsData extends UnknownOperationsData,
  OperationId extends Extract<keyof OperationsData, string> = Extract<
    keyof OperationsData,
    string
  >
> = {
  [Key in OperationId]: OperationConfig<Key, OperationsData>;
};

export type TaskState<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  currentOperationId: OperationId;
  prevOperationIds: OperationId[];
  operations: Operations<OperationId, OperationsData> | null;
};

export type TaskApi<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  run: () => void;
  runOperation: (operationId: OperationId) => void;
  getOperationData: <Id extends OperationId>(
    operationId: Id
  ) => OperationsData[Id];
  setOperationData: <Id extends OperationId>(
    operationId: Id,
    data: OperationsData[Id]
  ) => void;
};
