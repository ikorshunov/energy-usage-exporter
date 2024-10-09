import { getEnergyUsage } from "../api/getEnergyUsage.js";
import { OperationImplementationParams } from "../engine/types.js";
import { loader } from "../prompts/loader.js";
import { LocalEnergyUsage, TaskOperationsData } from "../types.js";

export const exportData = async ({
  getData,
  done,
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

  const exportData = (await loader(
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
  )) as LocalEnergyUsage;
  done({ exportData });
};
