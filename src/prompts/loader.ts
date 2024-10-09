import {
  createPrompt,
  Status,
  usePrefix,
  useState,
  makeTheme,
  useEffect,
} from "@inquirer/core";

type LoaderPromptConfig<StartLoadingFunction> = {
  startLoading: StartLoadingFunction;
  message: (status: "success" | "error" | "pending") => string;
};

export const loader = createPrompt<
  [unknown, { status: number } | undefined],
  LoaderPromptConfig<() => Promise<unknown>>
>(({ startLoading, message }, done) => {
  const theme = makeTheme();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState<string>();
  const prefix = usePrefix({ status, theme });

  useEffect(() => {
    startLoading()
      .then((result) => {
        setStatus("done");
        done([result, undefined]);
      })
      .catch((error) => {
        setStatus("idle");
        if (typeof error === "object" && error !== null) {
          setErrorMessage(error.message);
          done([null, { status: error.status }]);
        } else {
          setErrorMessage("Unknown error");
          done([null, { status: -1 }]);
        }
      });
  }, []);

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
