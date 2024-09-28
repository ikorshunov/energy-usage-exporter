import { useEffect } from "react";
import { useDataAccessToken } from "../tokens/useDataAccessToken.js";
import { StepComponentProps } from "../types.js";

type DataAccessTokenStepProps = StepComponentProps<"data-access-token"> & {
  authToken: string;
};

export const DataAccessTokenStep = (props: DataAccessTokenStepProps) => {
  const { onComplete, onFail, onDataChange, authToken } = props;
  const dataAccessToken = useDataAccessToken(authToken);

  useEffect(() => {
    if (dataAccessToken === null) {
      onDataChange?.({ dataAccessToken });
      onFail?.();
    } else if (dataAccessToken !== undefined) {
      onComplete({ dataAccessToken });
    }
  }, [dataAccessToken, onComplete, onFail]);

  return null;
};
