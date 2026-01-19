import { useQuery } from "@tanstack/react-query";
import { giphyApi } from "./giphy";

export const useGiphySearch = (q: string) => {
  const query = q.trim();

  return useQuery({
    queryKey: ["giphy", "search", query],
    queryFn: () => giphyApi.searchGifs({ q: query, limit: 24 }),
    enabled: query.length > 0,
    staleTime: 60_000,
  });
};
