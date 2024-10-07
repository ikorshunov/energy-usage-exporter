import {
  createPrompt,
  makeTheme,
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
  unknown,
  ChunkLoaderPromptConfig<unknown>
>((config, done) => {
  const theme = makeTheme();
  const prefix = usePrefix({ status: "loading", theme });
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
      done([]);
    }
  });

  useEffect(() => {
    if (currentChunkIndex === chunks.current.length) {
      done([]);
      return;
    }

    if (chunks.current.length === 0) {
      return;
    }

    const startLoading = chunks.current[currentChunkIndex];
    startLoading().then(() => {
      setCurrentChunkIndex(currentChunkIndex + 1);
    });
  }, [currentChunkIndex]);

  return `${prefix} ${currentChunkIndex + 1}/${
    chunks.current.length
  } chunks loaded... ${theme.style.help("Press ESC to stop")}`;
});
