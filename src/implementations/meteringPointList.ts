import { getMeteringPoints } from "../api/getMeteringPoints.js";
import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";

export const meteringPointList = ({
  done,
  getData,
  retry,
}: OperationImplementationParams<
  "metering-point-list",
  TaskOperationsData
>) => {
  const { customerIdType } = getData("customer-id-type");
  const { customerIdValue = "" } = getData("customer-id-value");
  getMeteringPoints({ customerIdType, customerIdValue }).then(
    (meteringPointList) => {
      if (meteringPointList.length === 0) {
        retry("customer-id-type");
      } else {
        done({ meteringPointList });
      }
    }
  );
};
