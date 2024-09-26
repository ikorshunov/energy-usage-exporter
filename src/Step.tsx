import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";

export type StepStatus = "pending" | "completed" | "failed";
export type StepConfig = Record<StepStatus, { description: string }>;

type StepProps = {
  status: StepStatus;
  config: StepConfig;
};

export const Step = (props: StepProps) => {
  const { status, config } = props;

  return (
    <Box gap={1}>
      <Text color={status === "failed" ? "red" : "green"}>
        {status === "pending" ? (
          <Spinner />
        ) : status === "completed" ? (
          "✔"
        ) : (
          "x"
        )}
      </Text>
      <Text>{config[status].description}</Text>
    </Box>
  );
};
