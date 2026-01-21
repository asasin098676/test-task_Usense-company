import { useQuery } from "@tanstack/react-query";
import { giphyApi } from "./giphy";

const MIN_QUERY_LENGTH = 2;

export function useGiphySearch(query: string) {
  return useQuery({
    queryKey: ["gifs", query],
    enabled: query.length >= MIN_QUERY_LENGTH,

    queryFn: ({ signal }) => giphyApi.searchGifs({ q: query }, { signal }),

    staleTime: 1000 * 60,
    retry: (failureCount, error) => {
      if (error instanceof DOMException && error.name === "AbortError") {
        return false;
      }
      return failureCount < 2;
    },
  });
}
