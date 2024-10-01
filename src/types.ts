export type CustomerIdType = "authorizationId" | "customerCVR" | "customerKey";
export type TaskOperationsData = {
  "auth-token": {
    authToken?: string;
  };
  "data-access-token": {
    dataAccessToken?: string;
  };
  "customer-id-type": {
    customerIdType: CustomerIdType;
  };
  "customer-id-value": {
    customerIdValue?: string;
  };
};
