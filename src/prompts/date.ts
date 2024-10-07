import {
  createPrompt,
  makeTheme,
  Status,
  useKeypress,
  usePrefix,
  useState,
} from "@inquirer/core";
import colors from "yoctocolors";

type DatePromptConfig = {
  default?: string;
  message: string;
  errorMessage?: string;
  validate?: (input: string) => boolean;
};

const cursorHide = "\u001B[?25l";
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const datePrompt = createPrompt<string, DatePromptConfig>(
  (
    { default: defaultValue, message, errorMessage, validate = () => true },
    done
  ) => {
    const theme = makeTheme({
      style: {
        highlight: (input) => colors.bgWhite(colors.black(input)),
      },
    });
    const [isError, setIsError] = useState(false);
    const [status, setStatus] = useState<Status>("idle");
    const prefix = usePrefix({ status, theme });
    const date = new Date(defaultValue || Date.now());
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const [dateArr, setDateArr] = useState([year, month, day] as const);
    const [dateArrIndex, setDateArrIndex] = useState(0);

    const updateDateValue = (value: typeof dateArr) => {
      setDateArr(value);
      setIsError(!validate(value.join("-")));
    };

    useKeypress((key) => {
      if (key.name === "left") {
        setDateArrIndex((dateArrIndex - 1 + 3) % 3);
      } else if (key.name === "right") {
        setDateArrIndex((dateArrIndex + 1) % 3);
      } else if (key.name === "up") {
        if (dateArrIndex === 0) {
          updateDateValue([
            Math.min(9999, dateArr[0] + 1),
            dateArr[1],
            dateArr[2],
          ]);
        } else if (dateArrIndex === 1) {
          const newMonth = Math.min(12, dateArr[1] + 1);
          const daysInNewMonth = daysInMonth[newMonth - 1];
          updateDateValue([
            dateArr[0],
            newMonth,
            Math.min(dateArr[2], daysInNewMonth),
          ]);
        } else if (dateArrIndex === 2) {
          const daysInCurrentMonth = daysInMonth[dateArr[1] - 1];
          updateDateValue([
            dateArr[0],
            dateArr[1],
            Math.min(daysInCurrentMonth, dateArr[2] + 1),
          ]);
        }
      } else if (key.name === "down") {
        if (dateArrIndex === 0) {
          updateDateValue([
            Math.max(0, dateArr[0] - 1),
            dateArr[1],
            dateArr[2],
          ]);
        } else if (dateArrIndex === 1) {
          const newMonth = Math.max(1, dateArr[1] - 1);
          const daysInNewMonth = daysInMonth[newMonth - 1];
          updateDateValue([
            dateArr[0],
            newMonth,
            Math.min(dateArr[2], daysInNewMonth),
          ]);
        } else if (dateArrIndex === 2) {
          updateDateValue([
            dateArr[0],
            dateArr[1],
            Math.max(1, dateArr[2] - 1),
          ]);
        }
      } else if (key.name === "return") {
        const value = dateArr.join("-");
        if (!isError) {
          setStatus("done");
          done(value);
        }
      }
    });

    let value = dateArr
      .map((entry, index) => {
        let stringEntry = entry.toString();
        if (stringEntry.length === 1 && (index === 1 || index === 2)) {
          stringEntry = `0${stringEntry}`;
        } else if (index === 0 && stringEntry.length < 4) {
          stringEntry = "0".repeat(4 - stringEntry.length) + stringEntry;
        }

        if (index === dateArrIndex && status !== "done") {
          return theme.style.highlight(stringEntry);
        }
        return stringEntry;
      })
      .join("-");

    value = status === "done" ? theme.style.answer(value) : value;

    return [
      `${prefix} ${theme.style.message(message, status)} ${value}${cursorHide}`,
      isError ? theme.style.error(errorMessage || "Invalid input") : undefined,
    ] as const;
  }
);
