export type OperationStatus = "pending" | "success" | "error";

export type UnknownOperationsData = Record<string, Record<string, unknown>>;

export type OperationImplementationParams<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  getData: {
    <Id extends keyof OperationsData>(operationId: Id): OperationsData[Id];
    (): OperationsData[OperationId];
  };
  done: (
    data:
      | OperationsData[OperationId]
      | ((
          prevData: OperationsData[OperationId]
        ) => OperationsData[OperationId]),
    restart?: boolean
  ) => void;
  retry: {
    <Id extends keyof OperationsData>(operationId: Id): void;
    (): void;
  };
};

export type OperationConfig<
  OperationId extends string,
  OperationsData extends UnknownOperationsData,
  NextOperationId = Exclude<keyof OperationsData, OperationId>
> = {
  id: OperationId;
  isInitial?: boolean;
  nextOperationId?:
    | NextOperationId
    | ((data: OperationsData[OperationId]) => NextOperationId);
  implementation: (
    params: OperationImplementationParams<OperationId, OperationsData>
  ) => void;
};

export type Operation<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  readonly id: OperationId;
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
  restart: () => void;
};
