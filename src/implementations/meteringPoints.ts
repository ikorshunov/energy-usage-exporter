import { confirm } from "@inquirer/prompts";
import { getMeteringPointIds } from "../api/getMeteringPointIds.js";
import { getInitialAggregatedMeteringPointsData } from "../config.js";
import { OperationImplementationParams } from "../engine/types.js";
import { loader } from "../prompts/loader.js";
import {
  AggregatedMeteringPointsData,
  MeteringPoint,
  TaskOperationsData,
} from "../types.js";
import { chunkLoader } from "../prompts/chunkLoader.js";
import { getMeteringPointDetails } from "../api/getMeteringPointDetails.js";

export const meteringPoints = async ({
  done,
  getData,
  retry,
}: OperationImplementationParams<"metering-points", TaskOperationsData>) => {
  const { customerIdType } = getData("customer-id-type");
  const { customerIdValue = "" } = getData("customer-id-value");
  const startLoading = () =>
    getMeteringPointIds({ customerIdType, customerIdValue });

  const [meteringPointIds, meteringPointsError] = await loader(
    {
      startLoading,
      message: (status) => {
        if (status === "pending") {
          return "Requesting metering point IDs";
        }
        if (status === "success") {
          return "Metering point IDs received";
        }
        return "Failed to get metering points:";
      },
    },
    {
      clearPromptOnDone: true,
    }
  );

  if (meteringPointsError) {
    if (meteringPointsError.status === 401) {
      return retry("data-access-token");
    } else {
      console.log("\nUnknown error\n");
      process.exit(1);
    }
  }

  if ((meteringPointIds as string[]).length === 0) {
    return confirm({
      message: "No metering points found. Do you want to try another customer?",
    }).then((bool) => {
      if (bool) {
        retry("customer-id-type");
      }
    });
  }

  const loadedMeteringPointIds: string[] = [];
  let aggregatedData: AggregatedMeteringPointsData =
    getInitialAggregatedMeteringPointsData();

  const [_, meteringPointDetailsError] = await chunkLoader(
    {
      chunkSize: 10,
      items: meteringPointIds as string[],
      startLoadingChunk: async (chunk) => {
        const meteringPoints = await getMeteringPointDetails(chunk as string[]);
        loadedMeteringPointIds.push(
          ...meteringPoints.map((mp) => mp.meteringPointId)
        );
        aggregatedData = (meteringPoints as MeteringPoint[]).reduce(
          (acc, meteringPoint) => {
            const { streetName, buildingNumber } = meteringPoint;
            if (!(streetName in acc.data)) {
              acc.data[streetName] = {
                [buildingNumber]: [meteringPoint],
              };
              acc.totalStreets++;
              acc.totalBuildings++;
            } else if (!(buildingNumber in acc.data[streetName])) {
              acc.data[streetName][buildingNumber] = [meteringPoint];
              acc.totalBuildings++;
            } else {
              acc.data[streetName][buildingNumber].push(meteringPoint);
            }
            return acc;
          },
          aggregatedData
        );
      },
    },
    {
      clearPromptOnDone: true,
    }
  );

  if (meteringPointDetailsError) {
    if (meteringPointDetailsError.status === 401) {
      return retry("data-access-token");
    } else {
      console.log("\nUnknown error\n");
      process.exit(1);
    }
  }

  const { totalStreets, totalBuildings } = aggregatedData;
  const totalStreetsText = totalStreets === 1 ? "street" : "streets";
  const totalBuildingsText = totalBuildings === 1 ? "building" : "buildings";
  const totalMeteringPointsText =
    loadedMeteringPointIds.length === 1 ? "metering point" : "metering points";

  const message = `Found ${loadedMeteringPointIds.length} ${totalMeteringPointsText} in ${totalBuildings} ${totalBuildingsText} on ${totalStreets} ${totalStreetsText}`;
  return loader({
    message: () => message,
    startLoading: () => Promise.resolve(),
  }).then(() => {
    done({ meteringPoints: aggregatedData });
  });
};
