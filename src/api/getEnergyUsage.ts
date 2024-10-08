import { ApiEnergyUsage, LocalEnergyUsage } from "../types.js";
import { makeApiRequest } from "./makeApiRequest.js";

type GetEnergyUsageParams = {
  startDate: string;
  endDate: string;
  timeAggregation: "Hour" | "Year";
  meteringPointIds: string[];
};

export const getEnergyUsage = (params: GetEnergyUsageParams) => {
  const { startDate, endDate, timeAggregation, meteringPointIds } = params;
  return makeApiRequest<LocalEnergyUsage>(
    `/meterdata/gettimeseries/${startDate}/${endDate}/${timeAggregation}`,
    {
      method: "POST",
      body: {
        meteringPoints: {
          meteringPoint: meteringPointIds,
        },
      },
      transform: (data) => {
        return (data as ApiEnergyUsage)
          .filter(
            ({ success, MyEnergyData_MarketDocument }) =>
              success &&
              MyEnergyData_MarketDocument["period.timeInterval"] !== null
          )
          .map(({ MyEnergyData_MarketDocument, id }) => {
            const { TimeSeries } = MyEnergyData_MarketDocument;
            const localTimeSeries = TimeSeries.map(
              ({ "measurement_Unit.name": unit, Period }) => {
                const periods = Period.map(({ Point, timeInterval }) => {
                  return {
                    timeInterval: `${timeInterval.start}-${timeInterval.end}`,
                    points: Point.map(
                      ({ "out_Quantity.quantity": quantity }) => quantity
                    ),
                  };
                });
                return { unit, periods };
              }
            );

            return { id, ...localTimeSeries[0] };
          });
      },
      expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days,
    }
  );
};
