import { CustomerIdType } from "../types.js";
import { makeApiRequest } from "./makeApiRequest.js";

export const getMeteringPointIds = (params: {
  customerIdType: CustomerIdType;
  customerIdValue: string;
}) => {
  return makeApiRequest<string[]>(
    `/authorization/authorization/meteringpointids/${params.customerIdType}/${params.customerIdValue}`,
    {
      expiresIn: 1000 * 60 * 60 * 24 * 7, // 7 days
    }
  );
};
