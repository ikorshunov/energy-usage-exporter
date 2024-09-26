import { Box, Text } from "ink";
import React from "react";

const GREETING_MESSAGE = "Hej! Håber dette hjælper dig, Sebastian :)";

export const Greeting = () => {
  return (
    <Box
      width={GREETING_MESSAGE.length + 4}
      paddingX={1}
      borderStyle="singleDouble"
      borderColor="#af00ff"
    >
      <Text color="#00abff">{GREETING_MESSAGE}</Text>
    </Box>
  );
};
