export type TaskOperationsData = {
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
    customerIdValue: string | null;
  };
};
