type OperationStatus = "pending" | "success" | "error";

export type UnknownOperationsData = Record<string, Record<string, unknown>>;

type GetOperationLabel<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  (data: OperationsData[OperationId], context: OperationsData): string;
};

type GetOperationStatus<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  (data: OperationsData[OperationId], context: OperationsData): OperationStatus;
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

export type TaskAgentConfig<
  OperationsData extends UnknownOperationsData,
  OperationId extends Extract<keyof OperationsData, string> = Extract<
    keyof OperationsData,
    string
  >
> = {
  [Key in OperationId]: OperationConfig<Key, OperationsData>;
};

export type TaskAgent<
  OperationId extends string,
  OperationsData extends UnknownOperationsData
> = {
  readonly config: TaskAgentConfig<OperationsData>;
  currentOperationId: OperationId;
  prevOperationIds: OperationId[];
  operations: Operations<OperationId, OperationsData>;
};
