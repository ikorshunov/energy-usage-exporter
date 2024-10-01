import {
  createPrompt,
  Status,
  usePrefix,
  useState,
  makeTheme,
} from "@inquirer/core";

type ApiRequestPromptConfig<StartRequestFunction> = {
  startRequest: StartRequestFunction;
  message: (status: "success" | "error" | "pending") => string;
};

export const apiRequest = createPrompt<
  unknown,
  ApiRequestPromptConfig<() => Promise<unknown>>
>(({ startRequest, message }, done) => {
  const theme = makeTheme();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>();
  const prefix = usePrefix({ status, theme });

  startRequest()
    .then((result) => {
      setStatus("done");
      done(result);
    })
    .catch((error) => {
      setStatus("idle");
      setErrorMessage(error.statusText);
      done(null);
    });

  let themeMessage: string = "";
  let themePrefix: string = prefix;
  if (status === "loading") {
    themeMessage = theme.style.message(message("pending"), status);
  } else if (status === "done") {
    themeMessage = theme.style.message(message("success"), status);
  } else if (errorMessage) {
    themeMessage = theme.style.message(
      theme.style.error(`${message("error")} ${errorMessage}`),
      status
    );
    themePrefix = "";
  }

  return themePrefix ? `${themePrefix} ${themeMessage}` : themeMessage;
});
