import React from "react";
import TextInput from "ink-text-input";

export const AuthTokenInput = ({
  onSubmit,
}: {
  onSubmit: (token: string) => void;
}) => {
  const [token, setToken] = React.useState("");

  return (
    <TextInput
      value={token}
      onChange={setToken}
      placeholder="Ctrl+V the token you got from eloverblik.dk"
      onSubmit={onSubmit}
    />
  );
};
