import { getEnergyUsage } from "../api/getEnergyUsage.js";
import { OperationImplementationParams } from "../engine/types.js";
import { loader } from "../prompts/loader.js";
import { LocalEnergyUsage, TaskOperationsData } from "../types.js";

export const exportData = async ({
  getData,
  done,
  retry,
}: OperationImplementationParams<"export-data", TaskOperationsData>) => {
  const { startDate, endDate, timeAggregation } = getData("export-params");
  const { meteringPointIds } = getData("selected-metering-points");
  const { meteringPointId } = getData("has-metering-point");
  const startLoading = () => {
    return getEnergyUsage({
      startDate,
      endDate,
      timeAggregation,
      meteringPointIds: meteringPointId ? [meteringPointId] : meteringPointIds,
    });
  };

  const [exportData, error] = await loader(
    {
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
    },
    {
      clearPromptOnDone: true,
    }
  );

  if (error) {
    if (error.status === 401) {
      return retry("data-access-token");
    } else {
      console.log("\nUnknown error\n");
      process.exit(1);
    }
  }

  done({ exportData: exportData as LocalEnergyUsage });
};
