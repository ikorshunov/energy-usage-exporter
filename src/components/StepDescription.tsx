import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import React from "react";
import { OperationStatus } from "../engine/types.js";

type StepProps = {
  status: OperationStatus;
  description: string;
};

export const StepDescription = (props: StepProps) => {
  const { status, description } = props;

  return (
    <Box gap={1}>
      <Text color={status === "error" ? "red" : "green"}>
        {status === "pending" ? <Spinner /> : status === "success" ? "✔" : "x"}
      </Text>
      <Text>{description}</Text>
    </Box>
  );
};
