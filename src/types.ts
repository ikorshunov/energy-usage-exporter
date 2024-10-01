export type CustomerIdType = "authorizationId" | "customerCVR" | "customerKey";
export type MeteringPoint = {
  meteringPointId: string;
  streetName: string;
  buildingNumber: string;
  floorId: string;
  roomId: string;
  postcode: string;
  cityName: string;
};
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
  "metering-point-list": {
    meteringPointList: MeteringPoint[];
  };
};
