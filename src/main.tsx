#!/usr/bin/env node

import React from "react";
import { Box, render, Static } from "ink";
import { config } from "./config.js";
import { StepDescription } from "./components/StepDescription.js";
import { Greeting } from "./components/Greeting.js";
import { StepId, StepsState } from "./types.js";
import { getStepDescriptionProps } from "./utils.js";

const App = () => {
  const [currentStepId, setCurrentStepId] =
    React.useState<StepId>("auth-token");
  const [completedSteps, setCompletedSteps] = React.useState<StepId[]>([]);
  const [stepsState, setStepsState] = React.useState<StepsState>({
    "auth-token": { authToken: undefined },
  });

  const { status: currentStepStatus, description: currentStepDescription } =
    getStepDescriptionProps(config[currentStepId], stepsState);

  return (
    <Box flexDirection="column">
      <Greeting />
      <Static items={completedSteps}>
        {(stepId) => {
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
        {config[currentStepId].render?.(stepsState)}
      </Box>
    </Box>
  );
};

render(<App />);
