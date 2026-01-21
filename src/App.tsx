import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { GifGrid } from "./components/GifGrid";
import { useGiphySearch } from "./api/useGiphySearch";
import type { GiphyGif } from "./types/giphy";
import "./App.css";
import { copyToClipboard, downloadFile } from "./utils/gifActions";
import { DEFAULT_SEARCH_QUERY, TOAST_DURATION_MS } from "./constants/app";
import { UI_TEXT } from "./constants/ui";
import { useDebouncedValue } from "./hooks/useDebouncedValue";

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_MS = 350;

const isAbortError = (err: unknown): boolean =>
  err instanceof DOMException && err.name === "AbortError";

export default function App() {
  const [query, setQuery] = useState(DEFAULT_SEARCH_QUERY);
  const [selected, setSelected] = useState<GiphyGif | null>(null);

  const normalizedQuery = useMemo(() => query.trim(), [query]);
  const debouncedQuery = useDebouncedValue(normalizedQuery, DEBOUNCE_MS);

  const canSearch = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const { data, isLoading, error, isFetching } = useGiphySearch(debouncedQuery);

  const gifs = useMemo(() => data?.data ?? [], [data?.data]);

  const detailsRef = useRef<HTMLDivElement | null>(null);

  const [toast, setToast] = useState<string | null>(null);
  const [isDownloading, setDownloading] = useState(false);

  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);

    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const handleSelect = useCallback((gif: GiphyGif) => {
    setSelected(gif);
  }, []);

  useEffect(() => {
    if (!canSearch) {
      setSelected(null);
    }
  }, [canSearch]);

  useEffect(() => {
    if (selected && detailsRef.current) {
      detailsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [selected]);

  const shouldShowError =
    Boolean(error) && !isAbortError(error) && debouncedQuery.length > 0;

  return (
    <div className="background">
      <div className="container">
        <h1 className="title">{UI_TEXT.TITLE}</h1>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => {}}
          isLoading={isFetching}
        />

        {shouldShowError && <div className="error">{UI_TEXT.ERROR}</div>}

        {isLoading && <div className="loading">{UI_TEXT.LOADING}</div>}

        {!canSearch ? (
          <div className="empty">
            {debouncedQuery.length === 0
              ? UI_TEXT.HINT_EMPTY
              : (UI_TEXT.HINT_MIN_LEN ??
                `Enter at least ${MIN_QUERY_LENGTH} characters`)}
          </div>
        ) : gifs.length > 0 ? (
          <GifGrid gifs={gifs} onSelect={handleSelect} />
        ) : (
          !isFetching && <div className="empty">{UI_TEXT.EMPTY}</div>
        )}

        {selected && (
          <div ref={detailsRef}>
            <div className="gif-details">
              <div className="gif-details__preview">
                <img
                  src={selected.images.original.url}
                  alt={selected.title || "GIF"}
                />
              </div>

              <div className="gif-details__info">
                <h2 className="gif-details__title">
                  {selected.title || UI_TEXT.UNTITLED}
                </h2>

                <div className="gif-details__row">
                  <span>{UI_TEXT.AUTHOR_LABEL}</span>
                  <strong>
                    {selected.user?.display_name ||
                      selected.username ||
                      UI_TEXT.UNKNOWN}
                  </strong>
                </div>

                <div className="gif-details__row">
                  <span>{UI_TEXT.CREATED_LABEL}</span>
                  <strong>{selected.import_datetime || UI_TEXT.UNKNOWN}</strong>
                </div>

                <div className="gif-details__actions">
                  {selected.url && (
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noreferrer"
                      className="gif-btn"
                    >
                      {UI_TEXT.OPEN_ON_GIPHY}
                    </a>
                  )}

                  <button
                    type="button"
                    className="gif-btn"
                    onClick={async () => {
                      try {
                        const link = selected.images.original.url;
                        await copyToClipboard(link);
                        showToast(UI_TEXT.TOAST.COPIED);
                      } catch {
                        showToast(UI_TEXT.COPY_FAILED);
                      }
                    }}
                  >
                    {UI_TEXT.COPY_LINK}
                  </button>

                  <button
                    type="button"
                    className="gif-btn"
                    disabled={isDownloading}
                    onClick={async () => {
                      try {
                        setDownloading(true);

                        const directUrl = selected.images.original.url;
                        const safeTitle =
                          (selected.title || "giphy")
                            .toLowerCase()
                            .replace(/[^a-z0-9-_]+/gi, "-")
                            .replace(/-+/g, "-")
                            .replace(/^-|-$/g, "") || "giphy";

                        await downloadFile(directUrl, `${safeTitle}.gif`);
                        showToast(UI_TEXT.TOAST.DOWNLOADED);
                      } catch {
                        showToast(UI_TEXT.TOAST.DOWNLOAD_FAILED);
                      } finally {
                        setDownloading(false);
                      }
                    }}
                  >
                    {isDownloading ? UI_TEXT.DOWNLOADING : UI_TEXT.DOWNLOAD}
                  </button>
                </div>

                {toast && <div className="toast">{toast}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
