export type OperationStatus = "pending" | "success" | "error";

export type UnknownOperationsData = Record<string, Record<string, unknown>>;

type GetOperationLabel<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  (
    data: OperationsData[OperationId],
    task: TaskApi<Extract<keyof OperationsData, string>, OperationsData>
  ): string;
};

type GetOperationStatus<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  (
    data: OperationsData[OperationId],
    task: TaskApi<Extract<keyof OperationsData, string>, OperationsData>
  ): OperationStatus;
};

type OperationLabelConfig<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> =
  | {
      label: string;
    }
  | {
      getLabel: GetOperationLabel<OperationId, OperationsData>;
    };

type OperationConfig<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  id: OperationId;
  isInitial?: boolean;
  getStatus: GetOperationStatus<OperationId, OperationsData>;
} & OperationLabelConfig<OperationId, OperationsData>;

type Operation<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  readonly id: OperationId;
  readonly label: string;
  readonly status: OperationStatus;
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

export type Task<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  readonly config: TaskConfig<OperationsData>;
  currentOperationId: OperationId;
  prevOperationIds: OperationId[];
  operations: Operations<OperationId, OperationsData> | null;
};

export type TaskApi<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  getOperation: <ExactOperationId extends OperationId>(
    operationId: ExactOperationId
  ) => Omit<Operation<ExactOperationId, OperationsData>, "data">;
};
