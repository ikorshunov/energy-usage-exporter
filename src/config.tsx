import React from "react";
import { StepsConfig } from "./types.js";
import { AuthTokenStep } from "./components/AuthTokenStep.js";

export const config: StepsConfig = {
  "auth-token": {
    id: "auth-token",
    description: (state) => ({
      pending:
        state["auth-token"]?.authToken === undefined
          ? "Looking for auth token..."
          : "Provide auth token:",
      completed: "Auth token",
      failed: "Missing auth token",
    }),
    render: (_state, callbacks) => {
      return (
        <AuthTokenStep
          id="auth-token"
          onDataChange={callbacks.onDataChange}
          onComplete={callbacks.onComplete}
          onFail={callbacks.onFail}
        />
      );
    },
    status: (state) => {
      const { authToken } = state["auth-token"] || {};

      return authToken ? "completed" : "pending";
    },
    nextSteps: {
      completed: ["data-access-token"],
    },
  },
  "data-access-token": {
    id: "data-access-token",
    description: {
      pending: "Requesting data access token...",
      completed: "Data access token received",
      failed: "Failed to get data access token",
    },
    status: (state) => {
      const { dataAccessToken } = state["data-access-token"] || {};
      if (!dataAccessToken) {
        return dataAccessToken === null ? "failed" : "pending";
      }
      return "completed";
    },
    nextSteps: {
      completed: ["customer-id-type"],
      failed: ["auth-token"],
    },
  },
  "customer-id-type": {
    id: "customer-id-type",
    description: (state) => ({
      pending: "Choose customer ID type:",
      completed: `Customer ID type selected: ${state["customer-id-type"]?.customerIdType}`,
      failed: "Customer ID type required",
    }),
    status: (state) => {
      const { customerIdType } = state["customer-id-type"] || {};

      return customerIdType ? "completed" : "pending";
    },
    nextSteps: {
      completed: ["customer-id-value"],
    },
  },
  "customer-id-value": {
    id: "customer-id-value",
    description: (state) => ({
      pending: "Enter customer ID:",
      completed: `Customer ID: ${state["customer-id-value"]?.customerIdValue}`,
      failed: "Customer ID value required",
    }),
    status: (state) => {
      const { customerIdValue } = state["customer-id-value"] || {};

      return customerIdValue ? "completed" : "pending";
    },
  },
};
