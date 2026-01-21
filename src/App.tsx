import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { GifGrid } from "./components/GifGrid";
import { useGiphySearch } from "./api/useGiphySearch";
import type { GiphyGif } from "./types/giphy";
import "./App.css";
import { copyToClipboard, downloadFile } from "./utils/gifActions";

export default function App() {
  const [query, setQuery] = useState("cat");
  const [selected, setSelected] = useState<GiphyGif | null>(null);

  const { data, isLoading, error, refetch, isFetching } = useGiphySearch(query);

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
    }, 1500);
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
    if (selected && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [selected]);
  return (
    <div className="background">
      <div className="container">
        <h1 className="title">GIF Search</h1>

        <SearchBar
          value={query}
          onChange={setQuery}
          onSubmit={() => refetch()}
          isLoading={isFetching}
        />

        {error && <div className="error">Failed to load GIFs</div>}
        {isLoading && <div className="loading">Loading…</div>}

        {gifs.length > 0 ? (
          <GifGrid gifs={gifs} onSelect={handleSelect} />
        ) : (
          !isFetching && <div className="empty">No results</div>
        )}
        {selected && (
          <div ref={detailsRef}>
            <div className="gif-details">
              <div className="gif-details__preview">
                <img src={selected.images.original.url} alt={selected.title} />
              </div>

              <div className="gif-details__info">
                <h2 className="gif-details__title">
                  {selected.title || "Untitled GIF"}
                </h2>

                <div className="gif-details__row">
                  <span>Author:</span>
                  <strong>
                    {selected.user?.display_name ||
                      selected.username ||
                      "Unknown"}
                  </strong>
                </div>

                <div className="gif-details__row">
                  <span>Created:</span>
                  <strong>{selected.import_datetime || "Unknown"}</strong>
                </div>

                <div className="gif-details__actions">
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noreferrer"
                    className="gif-btn"
                  >
                    Open on Giphy
                  </a>

                  <button
                    type="button"
                    className="gif-btn"
                    onClick={async () => {
                      const link = selected.images.original.url;
                      await copyToClipboard(link);
                      showToast("Link copied");
                    }}
                  >
                    Copy link
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
                        showToast("Downloaded");
                      } catch (e) {
                        console.error(e);
                        showToast("Download failed");
                      } finally {
                        setDownloading(false);
                      }
                    }}
                  >
                    {isDownloading ? "Downloading…" : "Download"}
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
