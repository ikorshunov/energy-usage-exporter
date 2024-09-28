import { UncontrolledTextInput } from "ink-text-input";
import { useAuthToken } from "../tokens/useAuthToken.js";
import React, { useEffect } from "react";
import { StepComponentProps } from "../types.js";

type AuthTokenStepProps = StepComponentProps<"auth-token"> & {
  dataAccessToken: string | null | undefined;
};

export const AuthTokenStep = (props: AuthTokenStepProps) => {
  const { onComplete, onDataChange, dataAccessToken } = props;
  const [authToken, setAuthToken] = useAuthToken();

  useEffect(() => {
    if (authToken === null) {
      onDataChange?.({ authToken });
    } else if (authToken !== undefined && dataAccessToken === undefined) {
      onComplete({ authToken });
    }
  }, [authToken, onComplete]);

  if (authToken === null || dataAccessToken === null) {
    return <UncontrolledTextInput onSubmit={setAuthToken} />;
  }

  return null;
};
