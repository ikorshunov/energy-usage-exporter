import { getMeteringPoints } from "../api/getMeteringPoints.js";
import { OperationImplementationParams } from "../engine/types.js";
import { apiRequest } from "../prompts/apiRequest.js";
import { MeteringPoint, TaskOperationsData } from "../types.js";

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
  const startRequest = () =>
    getMeteringPoints({ customerIdType, customerIdValue });

  apiRequest({
    startRequest,
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
      retry();
    } else {
      const list = meteringPointList as MeteringPoint[];
      if (list.length === 0) {
        retry("customer-id-type");
      } else {
        done({ meteringPointList: list });
      }
    }
  });
};
