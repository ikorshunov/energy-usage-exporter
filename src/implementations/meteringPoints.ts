import { confirm } from "@inquirer/prompts";
import { getMeteringPoints } from "../api/getMeteringPoints.js";
import { getInitialAggregatedMeteringPointsData } from "../config.js";
import { OperationImplementationParams } from "../engine/types.js";
import { loader } from "../prompts/loader.js";
import {
  AggregatedMeteringPointsData,
  MeteringPoint,
  TaskOperationsData,
} from "../types.js";

export const meteringPoints = ({
  done,
  getData,
  retry,
}: OperationImplementationParams<"metering-points", TaskOperationsData>) => {
  const { customerIdType } = getData("customer-id-type");
  const { customerIdValue = "" } = getData("customer-id-value");
  const startLoading = () =>
    getMeteringPoints({ customerIdType, customerIdValue });

  loader({
    startLoading,
    message: (status) => {
      if (status === "pending") {
        return "Requesting metering points";
      }
      if (status === "success") {
        return "Metering points received";
      }
      return "Failed to get metering points:";
    },
  }).then((meteringPointList) => {
    if (meteringPointList === null) {
      retry(); // TODO limit retries
    } else {
      const list = meteringPointList as MeteringPoint[];
      const aggregatedData: AggregatedMeteringPointsData = list.reduce(
        (acc, meteringPoint) => {
          const { streetName, buildingNumber } = meteringPoint;
          if (!(streetName in acc.data)) {
            acc.data[streetName] = {
              [buildingNumber]: [meteringPoint],
            };
            acc.totalStreets++;
          } else if (!(buildingNumber in acc.data[streetName])) {
            acc.data[streetName][buildingNumber] = [meteringPoint];
            acc.totalBuildings++;
          } else {
            acc.data[streetName][buildingNumber].push(meteringPoint);
          }
          return acc;
        },
        getInitialAggregatedMeteringPointsData()
      );
      const { totalStreets, totalBuildings } = aggregatedData;
      if (totalStreets === 0) {
        return confirm({
          message:
            "No metering points found. Do you want to try another customer?",
        }).then((bool) => {
          if (bool) {
            retry("customer-id-type");
          }
        });
      }

      const totalStreetsText = totalStreets === 1 ? "street" : "streets";
      const totalBuildingsText =
        totalBuildings === 1 ? "building" : "buildings";
      const totalMeteringPointsText =
        list.length === 1 ? "metering point" : "metering points";

      const message = `Found ${list.length} ${totalMeteringPointsText} in ${totalBuildings} ${totalBuildingsText} on ${totalStreets} ${totalStreetsText}`;
      return loader({
        message: () => message,
        startLoading: () => Promise.resolve(),
      }).then(() => {
        done({ meteringPoints: aggregatedData });
      });
    }
  });
};
