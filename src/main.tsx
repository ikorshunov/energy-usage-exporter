#!/usr/bin/env node

import React, { useCallback, useEffect, useMemo } from "react";
import { Box, render, Static, useApp } from "ink";
import { config } from "./config.js";
import { StepDescription } from "./components/StepDescription.js";
import { Greeting } from "./components/Greeting.js";
import { StepCallback, StepId, StepsState } from "./types.js";
import { getStepDescriptionProps } from "./utils.js";

const App = () => {
  const { exit } = useApp();
  const [currentStepId, setCurrentStepId] =
    React.useState<StepId>("auth-token");
  const [completedSteps, setCompletedSteps] = React.useState<StepId[]>([]);
  const [stepsState, setStepsState] = React.useState<StepsState>({
    "auth-token": { authToken: undefined },
  });

  const { status: currentStepStatus, description: currentStepDescription } =
    getStepDescriptionProps(config[currentStepId], stepsState);

  const onStepComplete: StepCallback<typeof currentStepId> = useCallback(
    (data) => {
      setStepsState((prev) => ({ ...prev, [currentStepId]: data }));
      setCompletedSteps((prev) => [...prev, currentStepId]);

      const nextSteps = config[currentStepId].nextSteps?.completed;
      if (nextSteps) {
        setCurrentStepId(nextSteps[0]);
      } else {
        exit();
      }
    },
    [currentStepId, exit]
  );

  const onStepFail = useCallback(() => {
    const nextSteps = config[currentStepId].nextSteps?.failed;
    if (nextSteps) {
      setCurrentStepId(nextSteps[0]);
    } else {
      exit();
    }
  }, [currentStepId, exit]);

  const onStepDataChange: StepCallback<typeof currentStepId> = useCallback(
    (data) => {
      setStepsState((prev) => ({ ...prev, [currentStepId]: data }));
    },
    [currentStepId]
  );

  const staticSectionItems = useMemo(() => {
    return [<Greeting key="greeting" />, ...completedSteps];
  }, [completedSteps]);

  return (
    <Box flexDirection="column">
      <Static items={staticSectionItems}>
        {(item) => {
          if (typeof item !== "string") return item;

          const stepId = item;
          const { status, description } = getStepDescriptionProps(
            config[stepId],
            stepsState
          );

          return (
            <StepDescription
              key={stepId}
              status={status}
              description={description}
            />
          );
        }}
      </Static>
      <Box flexDirection="column">
        <StepDescription
          status={currentStepStatus}
          description={currentStepDescription}
        />
        {config[currentStepId].render?.(stepsState, {
          onDataChange: onStepDataChange,
          onComplete: onStepComplete,
          onFail: onStepFail,
        })}
      </Box>
    </Box>
  );
};

render(<App />);
