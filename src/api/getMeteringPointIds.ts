import { CustomerIdType } from "../types.js";
import { makeApiRequest } from "./makeApiRequest.js";

export const getMeteringPointIds = (params: {
  customerIdType: CustomerIdType;
  customerIdValue: string;
}) => {
  return makeApiRequest<string[]>(
    `/authorization/authorization/meteringpointids/${params.customerIdType}/${params.customerIdValue}`
  );
};
