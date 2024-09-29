type OperationStatus = "pending" | "success" | "error";

type GetOperationLabel<
  OperationId extends string,
  OperationsData extends Record<OperationId, unknown>
> = {
  (context: OperationsData, data: OperationsData[OperationId]):
    | string
    | JSX.Element;
};

type GetOperationStatus<
  OperationId extends string,
  OperationsData extends Record<OperationId, unknown>
> = {
  (context: OperationsData, data: OperationsData[OperationId]): OperationStatus;
};

type OperationLabelConfig<
  OperationId extends string,
  OperationsData extends Record<OperationId, unknown>
> =
  | {
      label: string | JSX.Element;
    }
  | {
      getLabel: GetOperationLabel<OperationId, OperationsData>;
    };

type OperationConfig<
  OperationId extends string,
  OperationsData extends Record<OperationId, unknown>
> = {
  id: OperationId;
  isInitial?: boolean;
  getStatus: GetOperationStatus<OperationId, OperationsData>;
} & OperationLabelConfig<OperationId, OperationsData>;

export type TaskAgentConfig<
  OperationId extends string,
  OperationsData extends Record<OperationId, unknown>
> = {
  [Key in Extract<keyof OperationsData, string>]: OperationConfig<
    Key,
    OperationsData
  >;
};

export type TaskAgent<
  OperationId extends string,
  OperationsData extends Record<OperationId, unknown>
> = {
  readonly config: TaskAgentConfig<OperationId, OperationsData>;
  data: OperationsData;
  currentOperationId: OperationId;
  prevOperationIds: OperationId[];
};
