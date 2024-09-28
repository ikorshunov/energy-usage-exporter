import { UncontrolledTextInput } from "ink-text-input";
import { useAuthToken } from "../tokens/useAuthToken.js";
import React, { useEffect } from "react";
import { StepCallbacks, StepId } from "../types.js";

export type StepComponentProps<T extends StepId> = {
  id: T;
} & StepCallbacks<T>;

type AuthTokenStepProps = StepComponentProps<"auth-token">;

export const AuthTokenStep = (props: AuthTokenStepProps) => {
  const { onComplete, onDataChange } = props;
  const [authToken, setAuthToken] = useAuthToken();

  useEffect(() => {
    if (authToken === null) {
      onDataChange?.({ authToken });
    } else if (authToken !== undefined) {
      onComplete({ authToken });
    }
  }, [authToken, onComplete]);

  if (authToken === null) {
    return <UncontrolledTextInput onSubmit={setAuthToken} />;
  }

  return null;
};
