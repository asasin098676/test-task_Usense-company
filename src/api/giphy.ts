import { z } from "zod";
import {
  giphySearchResponseSchema,
  giphyGetByIdResponseSchema,
  type GiphySearchResponse,
  type GiphyGetByIdResponse,
} from "../schemas/giphy.schema";

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

type RequestOptions = {
  signal?: AbortSignal;
};

const buildUrl = (
  path: string,
  params: Record<string, string | number | undefined>,
): string => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("api_key", API_KEY ?? "");

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};

class ApiValidationError extends Error {
  details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message);
    this.name = "ApiValidationError";
    this.details = details;
  }
}

const fetchJson = async <T>(
  url: string,
  schema: z.ZodType<T>,
  options?: RequestOptions,
): Promise<T> => {
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `GIPHY request failed: ${response.status} ${response.statusText}${
        text ? ` — ${text}` : ""
      }`,
    );
  }

  const json: unknown = await response.json();

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    throw new ApiValidationError(
      "Invalid API response shape (GIPHY)",
      parsed.error.format(),
    );
  }

  return parsed.data;
};

export const giphyApi = {
  searchGifs(
    params: SearchParams,
    options?: RequestOptions,
  ): Promise<GiphySearchResponse> {
    const url = buildUrl("/search", {
      q: params.q,
      limit: params.limit ?? 24,
      offset: params.offset ?? 0,
      rating: params.rating,
      lang: params.lang ?? "en",
    });

    return fetchJson(url, giphySearchResponseSchema, options);
  },

  getGifById(
    id: string,
    options?: RequestOptions,
  ): Promise<GiphyGetByIdResponse> {
    const url = buildUrl(`/${encodeURIComponent(id)}`, {});
    return fetchJson(url, giphyGetByIdResponseSchema, options);
  },
};
