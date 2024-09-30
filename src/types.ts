export type TaskOperationsData = {
  "data-access-token": {
    authToken: string | null | undefined;
    dataAccessToken: string | null | undefined;
  };
  "customer-id-type": {
    customerIdType: "authorizationId" | "customerCVR" | "customerKey";
  };
  "customer-id-value": {
    customerIdValue: string | null;
  };
};
