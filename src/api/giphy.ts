import type { GiphySearchResponse } from "../types/giphy";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const BASE_URL = "https://api.giphy.com/v1/gifs";

if (!API_KEY) {
  console.warn("Missing VITE_GIPHY_API_KEY in .env");
}

type SearchParams = {
  q: string;
  limit?: number;
  offset?: number;
  rating?: "g" | "pg" | "pg-13" | "r";
  lang?: string;
};

const buildUrl = (
  path: string,
  params: Record<string, string | number | undefined>,
) => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY ?? "");
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    url.searchParams.set(k, String(v));
  });
  return url.toString();
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  console.log(res);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `GIPHY request failed: ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`,
    );
  }
  return (await res.json()) as T;
};

export const giphyApi = {
  searchGifs(params: SearchParams) {
    const url = buildUrl("/search", {
      q: params.q,
      limit: params.limit ?? 24,
      offset: params.offset ?? 0,
      rating: params.rating,
      lang: params.lang ?? "en",
    });
    return fetchJson<GiphySearchResponse>(url);
  },

  getGifById(id: string) {
    const url = buildUrl(`/${encodeURIComponent(id)}`, {});
    return fetchJson<{ data: any; meta: any }>(url);
  },
};
