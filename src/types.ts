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
  "has-metering-point": {
    meteringPointId?: string;
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
    exportData: LocalEnergyUsage;
  };
  "generate-files": {};
};

export type Cache = Record<
  string,
  {
    data: unknown;
    expires: number;
  }
>;

type ApiPoint = {
  position: string;
  "out_Quantity.quantity": string;
  "out_Quantity.quality": string;
};

type ApiPeriod = {
  timeInterval: { start: string; end: string };
  Point: ApiPoint[];
};

type LocalPeriod = {
  timeInterval: string;
  points: string[];
};

type ApiTimeSeries = {
  "measurement_Unit.name": string;
  Period: ApiPeriod[];
};

type LocalTimeSeries = {
  unit: string;
  periods: LocalPeriod[];
};

type ApiMeterData = {
  id: string;
  success: boolean;
  MyEnergyData_MarketDocument: {
    "period.timeInterval": { start: string; end: string } | null;
    TimeSeries: ApiTimeSeries[];
  };
};

type LocalMeterData = {
  id: string;
} & LocalTimeSeries;

export type ApiEnergyUsage = ApiMeterData[];

export type LocalEnergyUsage = LocalMeterData[];
