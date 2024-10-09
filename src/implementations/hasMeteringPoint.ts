import { input } from "@inquirer/prompts";
import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";

export const hasMeteringPoint = async ({
  done,
}: OperationImplementationParams<"has-metering-point", TaskOperationsData>) => {
  const meteringPointId = await input({
    message: "Enter metering point ID right away or skip:",
  });
  done({
    meteringPointId: meteringPointId ? String(meteringPointId) : undefined,
  });
};
