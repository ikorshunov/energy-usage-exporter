import { select, search } from "@inquirer/prompts";
import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";
import { KeypressEvent } from "@inquirer/core";

export const selectedMeteringPoints = ({
  getData,
  done,
  retry,
}: OperationImplementationParams<
  "selected-metering-points",
  TaskOperationsData
>) => {
  const {
    meteringPoints: { totalStreets, data },
  } = getData("metering-points");

  const selectStreet = () => {
    return search({
      message: "Select street:",
      source: (search) => {
        const allStreetNames = Object.keys(data);
        const foundStreetNames = search
          ? allStreetNames.filter((streetName) =>
              streetName.toLowerCase().includes(search.toLowerCase())
            )
          : allStreetNames;

        return foundStreetNames.sort().map((streetName) => ({
          name: streetName,
          value: streetName,
        }));
      },
    });
  };

  const selectBuilding = (streetName: string) => {
    const controller = new AbortController();
    const handler = (_: any, key: KeypressEvent) => {
      if (key.name === "escape") {
        controller.abort();
      }
    };
    process.stdin.on("keypress", handler);

    return select(
      {
        message: "Select building:",
        choices: Object.keys(data[streetName]).map((buildingNumber) => ({
          name: `${streetName} ${buildingNumber} (meters: ${data[streetName][buildingNumber].length})`,
          value: data[streetName][buildingNumber].map(
            (meteringPoint) => meteringPoint.meteringPointId
          ),
        })),
      },
      {
        signal: controller.signal,
      }
    )
      .then((meteringPointIds) => {
        done({ meteringPointIds });
      })
      .catch(() => {
        retry();
      })
      .finally(() => {
        process.stdin.off("keypress", handler);
      });
  };

  if (totalStreets === 1) {
    const streetName = Object.keys(data)[0];
    selectBuilding(streetName);
  } else {
    selectStreet().then((streetName) => selectBuilding(streetName));
  }
};
