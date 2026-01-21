import React from "react";
import type { GiphyGif } from "../types/giphy";

type Props = {
  gifs: GiphyGif[];
  onSelect: (gif: GiphyGif) => void;
};

export const GifGrid = React.memo(function GifGrid({ gifs, onSelect }: Props) {
  return (
    <div className="gif-grid">
      {gifs.map((gif) => (
        <button
          key={gif.id}
          className="gif-card"
          onClick={() => onSelect(gif)}
          title={gif.title || "GIF"}
        >
          <div className="gif-media">
            <img
              src={gif.images.fixed_width.url}
              alt={gif.title}
              loading="lazy"
            />
          </div>
        </button>
      ))}
    </div>
  );
});
