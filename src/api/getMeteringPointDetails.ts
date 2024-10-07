import { MeteringPoint } from "../types.js";
import { makeApiRequest } from "./makeApiRequest.js";

export const getMeteringPointDetails = (meteringPointIds: string[]) => {
  return makeApiRequest("/meteringpoint/getdetails", {
    method: "POST",
    body: { meteringPoints: { meteringPoint: meteringPointIds } },
    transform: (data): MeteringPoint[] => {
      return (data as Array<{ result: MeteringPoint; success: boolean }>)
        .filter((item) => item.success)
        .map((item) => {
          const meteringPoint = item.result;
          return {
            meteringPointId: meteringPoint.meteringPointId,
            streetName: meteringPoint.streetName,
            buildingNumber: meteringPoint.buildingNumber,
            floorId: meteringPoint.floorId,
            roomId: meteringPoint.roomId,
            postcode: meteringPoint.postcode,
            cityName: meteringPoint.cityName,
          };
        });
    },
  });
};
