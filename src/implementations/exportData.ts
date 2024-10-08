import { getEnergyUsage } from "../api/getEnergyUsage.js";
import { OperationImplementationParams } from "../engine/types.js";
import { loader } from "../prompts/loader.js";
import { TaskOperationsData } from "../types.js";

export const exportData = async ({
  getData,
  done,
}: OperationImplementationParams<"export-data", TaskOperationsData>) => {
  const { startDate, endDate, timeAggregation } = getData("export-params");
  const { meteringPointIds } = getData("selected-metering-points");
  const startLoading = () => {
    return getEnergyUsage({
      startDate,
      endDate,
      timeAggregation,
      meteringPointIds,
    });
  };

  const exportData = await loader({
    startLoading,
    message: (status) => {
      if (status === "pending") {
        return "Requesting energy usage data";
      }
      if (status === "success") {
        return "Energy usage data received";
      }
      return "Failed to get energy usage data:";
    },
  });
  done({ exportData });
};
