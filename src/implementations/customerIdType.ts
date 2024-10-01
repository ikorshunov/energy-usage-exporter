import { select } from "@inquirer/prompts";
import { OperationImplementationParams } from "../engine/types.js";
import { CustomerIdType, TaskOperationsData } from "../types.js";

export const customerIdType = ({
  done,
  getData,
}: OperationImplementationParams<"customer-id-type", TaskOperationsData>) => {
  select<CustomerIdType>({
    message: "Select customer ID type:",
    choices: [
      { name: "Customer key", value: "customerKey" },
      { name: "Customer CVR", value: "customerCVR" },
      { name: "Authorization ID", value: "authorizationId" },
    ],
    default: getData().customerIdType,
  }).then((customerIdType) => {
    done({ customerIdType });
  });
};
