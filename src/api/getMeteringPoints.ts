import { CustomerIdType, MeteringPoint } from "../types.js";
import { sleep } from "../utils.js";
import { makeApiRequest } from "./makeApiRequest.js";

export const getMeteringPoints = async (params: {
  customerIdType: CustomerIdType;
  customerIdValue: string;
}) => {
  const meteringPointIds = await makeApiRequest<MeteringPoint[]>(
    `/authorization/authorization/meteringpointids/${params.customerIdType}/${params.customerIdValue}`
  );

  const chunkSize = 10; // Define the size of each chunk
  const meteringPointChunks: MeteringPoint[][] = [];

  for (let i = 0; i < meteringPointIds.length; i += chunkSize) {
    const chunk = meteringPointIds.slice(i, i + chunkSize);
    meteringPointChunks.push(chunk);
  }

  const result = [];
  for (let i = 0; i < meteringPointChunks.length; i++) {
    const chunk = meteringPointChunks[i];
    const resultChunk = await makeApiRequest("/meteringpoint/getdetails", {
      method: "POST",
      body: { meteringPoints: { meteringPoint: chunk } },
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
    }).catch(() => {
      return [];
    });
    result.push(...resultChunk);
    await sleep(1000);
  }

  return result;
};
// pv screening grosserer hans peter jensens stiftelse
