import { OperationImplementationParams } from "../engine/types.js";
import { datePrompt } from "../prompts/date.js";
import { TaskOperationsData } from "../types.js";
import { select } from "@inquirer/prompts";

export const exportParams = async ({
  done,
  getData,
}: OperationImplementationParams<"export-params", TaskOperationsData>) => {
  const exportParamsData = getData("export-params");
  const startDate = await datePrompt({
    message: "Enter start date:",
    default: exportParamsData.startDate,
  });
  const endDate = await datePrompt({
    message: "Enter end date:",
    errorMessage: "End date must be after start date",
    default: exportParamsData.endDate,
    validate: (input) => {
      if (new Date(input).getTime() < new Date(startDate).getTime()) {
        return false;
      }
      return true;
    },
  });
  const timeAggregation = await select<"Hour" | "Year">({
    message: "Select time aggregation:",
    choices: ["Hour", "Year"],
    default: exportParamsData.timeAggregation,
  });
  done({
    startDate,
    endDate,
    timeAggregation,
  });
};
