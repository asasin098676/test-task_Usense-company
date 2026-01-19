import { useQuery } from "@tanstack/react-query";
import { giphyApi } from "./giphy";

export const useGiphySearch = (q: string) => {
  return useQuery({
    queryKey: ["giphy", "search", q],
    queryFn: () => giphyApi.searchGifs({ q }),
    enabled: q.trim().length > 0,
    staleTime: 60_000,
  });
};
