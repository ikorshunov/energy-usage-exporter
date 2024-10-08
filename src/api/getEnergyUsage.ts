import { makeApiRequest } from "./makeApiRequest.js";

type GetEnergyUsageParams = {
  startDate: string;
  endDate: string;
  timeAggregation: "Hour" | "Year";
  meteringPointIds: string[];
};

export const getEnergyUsage = (params: GetEnergyUsageParams) => {
  const { startDate, endDate, timeAggregation, meteringPointIds } = params;
  return makeApiRequest(
    `/meterdata/gettimeseries/${startDate}/${endDate}/${timeAggregation}`,
    {
      method: "POST",
      body: {
        meteringPoints: {
          meteringPoint: meteringPointIds,
        },
      },
      // @ts-ignore
      transform: (data: { success: boolean }[]) => {
        return data.filter(({ success }) => success);
      },
      expiresIn: 0,
    }
  );
};
