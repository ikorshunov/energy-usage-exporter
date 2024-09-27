import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";
import { StepStatus } from "./flow.js";

type StepProps = {
  status: StepStatus;
  description: string;
};

export const StepDescription = (props: StepProps) => {
  const { status, description } = props;

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
      <Text>{description}</Text>
    </Box>
  );
};
