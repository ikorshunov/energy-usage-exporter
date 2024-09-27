export type StepStatus = "pending" | "completed" | "failed";

export type StepId =
  | "auth-token"
  | "data-access-token"
  | "customer-id-type"
  | "customer-id-value";

export type Step = {
  id: StepId;
  description:
    | Record<StepStatus, string>
    | ((state: StepsState) => Record<StepStatus, string>);
  status: (state: StepsState) => StepStatus;
  render?: (state: StepsState) => JSX.Element; // TODO remove optional when implemented
  nextSteps?: {
    completed?: StepId[];
    failed?: StepId[];
  };
};

export type StepsConfig = Record<StepId, Step>;

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
