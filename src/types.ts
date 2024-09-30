export type TaskOperationsData = {
  "auth-token": {
    authToken?: string;
  };
  "data-access-token": {
    dataAccessToken?: string;
  };
  "customer-id-type": {
    customerIdType: "authorizationId" | "customerCVR" | "customerKey";
  };
  "customer-id-value": {
    customerIdValue?: string;
  };
};
