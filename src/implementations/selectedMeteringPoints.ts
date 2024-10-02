import { select } from "@inquirer/prompts";
import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";

export const selectedMeteringPoints = ({
  getData,
  done,
}: OperationImplementationParams<
  "selected-metering-points",
  TaskOperationsData
>) => {
  const {
    meteringPoints: { totalStreets, data },
  } = getData("metering-points");

  const selectStreet = () => {
    return select({
      message: "Select street:",
      choices: Object.keys(data).map((streetName) => ({
        name: streetName,
        value: streetName,
      })),
    });
  };

  const selectBuilding = (streetName: string) => {
    return select({
      message: "Select building:",
      choices: Object.keys(data[streetName]).map((buildingNumber) => ({
        name: `${streetName} ${buildingNumber}`,
        value: data[streetName][buildingNumber].map(
          (meteringPoint) => meteringPoint.meteringPointId
        ),
      })),
    }).then((meteringPointIds) => {
      done({ meteringPointIds });
    });
  };

  if (totalStreets === 1) {
    const streetName = Object.keys(data)[0];
    selectBuilding(streetName);
  } else {
    selectStreet().then((streetName) => selectBuilding(streetName));
  }
};
