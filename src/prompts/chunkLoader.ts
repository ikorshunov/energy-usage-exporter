import {
  createPrompt,
  makeTheme,
  Status,
  useEffect,
  useKeypress,
  usePrefix,
  useRef,
  useState,
} from "@inquirer/core";

type ChunkLoaderPromptConfig<Item> = {
  items: Item[];
  chunkSize: number;
  startLoadingChunk: (chunk: Item) => Promise<unknown>;
};

export const chunkLoader = createPrompt<
  [unknown, { status: number } | undefined],
  ChunkLoaderPromptConfig<unknown>
>((config, done) => {
  const theme = makeTheme();
  const [status, setStatus] = useState<Status>("loading");
  const prefix = usePrefix({ status, theme });
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const { items, chunkSize, startLoadingChunk } = config;

  const chunks = useRef<Array<() => Promise<unknown>>>([]);
  useEffect(() => {
    chunks.current = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      chunks.current.push(() => startLoadingChunk(chunk));
    }
  }, [items, chunkSize]);

  useKeypress((key) => {
    if (key.name === "escape") {
      setStatus("done");
      done([[], undefined]);
    }
  });

  useEffect(() => {
    if (currentChunkIndex === chunks.current.length) {
      setStatus("done");
      done([[], undefined]);
      return;
    }

    if (chunks.current.length === 0 || status === "done") {
      return;
    }

    const startLoading = chunks.current[currentChunkIndex];
    startLoading()
      .then(() => {
        if (status === "loading") {
          setCurrentChunkIndex(currentChunkIndex + 1);
        }
      })
      .catch((error) => {
        setStatus("done");
        if (typeof error === "object" && error !== null) {
          done([null, { status: error.status }]);
        } else {
          done([null, { status: -1 }]);
        }
      });
  }, [currentChunkIndex, status]);

  return `${prefix} ${currentChunkIndex + 1}/${
    chunks.current.length
  } chunks loaded... ${theme.style.help("Press ESC to stop")}`;
});
