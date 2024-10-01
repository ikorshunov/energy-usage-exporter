import { number, input } from "@inquirer/prompts";
import { OperationImplementationParams } from "../engine/types.js";
import { TaskOperationsData } from "../types.js";

export const customerIdValue = ({
  done,
  getData,
}: OperationImplementationParams<"customer-id-value", TaskOperationsData>) => {
  const { customerIdType } = getData("customer-id-type");
  const onEntered = (customerIdValue: string | number | undefined) => {
    if (!customerIdValue) {
      throw new Error("Customer ID value is required.");
    }
    done({ customerIdValue: customerIdValue.toString() });
  };

  if (
    customerIdType === "authorizationId" ||
    customerIdType === "customerCVR"
  ) {
    number({
      message: `Enter ${
        customerIdType === "authorizationId"
          ? "authorization ID"
          : "customer CVR"
      }:`,
      required: true,
    }).then(onEntered);
  } else {
    input({
      message: "Enter customer key:",
      required: true,
    }).then(onEntered);
  }
};
