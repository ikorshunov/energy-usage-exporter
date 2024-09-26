#!/usr/bin/env node

import React, { useMemo } from "react";
import { render } from "ink";
import { Greeting } from "./Greeting.js";
import { useAuthToken } from "./tokens/useAuthToken.js";
import { Step, StepConfig, StepStatus } from "./Step.js";
import { AuthTokenInput } from "./tokens/AuthTokenInput.js";
import { useDataAccessToken } from "./tokens/useDataAccessToken.js";

const getAuthStepStatus = (
  authToken: string | null | undefined,
  dataAccessToken: string | null | undefined
): StepStatus => {
  if (authToken === null) {
    return "failed";
  } else if (authToken !== undefined) {
    if (dataAccessToken === null) {
      return "failed";
    } else if (dataAccessToken === undefined) {
      return "pending";
    } else {
      return "completed";
    }
  }

  return "pending";
};

const getAuthStepConfig = (
  authToken: string | null | undefined
): StepConfig => {
  return {
    pending: {
      description: authToken
        ? "Requesting data access token"
        : "Checking authentication token",
    },
    completed: { description: "Data access token received" },
    failed: {
      description: authToken
        ? "Failed to get data access token"
        : "Authentication token not found",
    },
  };
};

const App = () => {
  const [authToken, setAuthToken] = useAuthToken();
  const dataAccessToken = useDataAccessToken(authToken);
  const authStepConfig = useMemo(
    () => getAuthStepConfig(authToken),
    [authToken]
  );

  return (
    <>
      <Greeting />
      <Step
        status={getAuthStepStatus(authToken, dataAccessToken)}
        config={authStepConfig}
      />
      {authToken === null && <AuthTokenInput onSubmit={setAuthToken} />}
    </>
  );
};

render(<App />);
