export type StepStatus = "pending" | "completed" | "failed";

export type StepId =
  | "auth-token"
  | "data-access-token"
  | "customer-id-type"
  | "customer-id-value";

export type StepCallback<T extends StepId> = (data: StepState<T>) => void;
export type StepFailCallback = VoidFunction;
export type StepCallbacks<T extends StepId> = {
  onComplete: StepCallback<T>;
  onDataChange?: StepCallback<T>;
  onFail?: StepFailCallback;
};

export type Step<T extends StepId = StepId> = {
  id: T;
  description:
    | Record<StepStatus, string>
    | ((state: StepsState) => Record<StepStatus, string>);
  status: (state: StepsState) => StepStatus;
  render?: (
    state: StepsState,
    callbacks: StepCallbacks<T>
  ) => JSX.Element | null; // TODO remove optional when implemented
  nextSteps?: {
    completed?: StepId;
    failed?: StepId;
  };
};

export type StepsConfig = {
  [K in StepId]: Step<K>;
};

export type StepDataMap = {
  "auth-token": {
    authToken: string | null | undefined;
  };
  "data-access-token": {
    dataAccessToken: string | null | undefined;
  };
  "customer-id-type": {
    customerIdType: "authorizationId" | "customerCVR" | "customerKey";
  };
  "customer-id-value": {
    customerIdValue: string;
  };
};

export type StepState<T extends StepId> = StepDataMap[T];

export type StepsState = {
  [K in StepId]?: StepState<K>;
};

export type StepComponentProps<T extends StepId> = {
  id: T;
} & StepCallbacks<T>;
