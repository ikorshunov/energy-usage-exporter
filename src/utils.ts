import { Step, StepsState, StepStatus } from "./types.js";

export function sleep(millis: number) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

export function getStepDescriptionProps(
  stepConfig: Step,
  stepsState: StepsState
) {
  const status = stepConfig.status(stepsState);
  const description =
    typeof stepConfig.description === "function"
      ? stepConfig.description(stepsState)
      : stepConfig.description;
  return { status, description: description[status] };
}
