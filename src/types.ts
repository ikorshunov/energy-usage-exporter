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
export type AggregatedMeteringPointsData = {
  totalStreets: number;
  totalBuildings: number;
  data: {
    [key: string]: {
      [key: string]: MeteringPoint[];
    };
  };
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
  "metering-points": {
    meteringPoints: AggregatedMeteringPointsData;
  };
  "selected-metering-points": {
    meteringPointIds: string[];
  };
  "export-params": {
    startDate: string;
    endDate: string;
    timeAggregation: "Hour" | "Year";
  };
  "export-data": {
    exportData: unknown;
  };
};

export type Cache = Record<
  string,
  {
    data: unknown;
    expires: number;
  }
>;
