import { CustomerIdType, MeteringPoint } from "../types.js";
import { makeApiRequest } from "./makeApiRequest.js";

export const getMeteringPoints = (params: {
  customerIdType: CustomerIdType;
  customerIdValue: string;
}) => {
  return makeApiRequest<MeteringPoint[]>(
    `/authorization/authorization/meteringpoints/${params.customerIdType}/${params.customerIdValue}`
  );
};
