import { useEffect, useState } from "react";
import "./SearchBar.css";

type Props = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
};

export const SearchBar = ({ value, onChange, onSubmit, isLoading }: Props) => {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const id = window.setTimeout(() => onChange(local), 350);
    return () => window.clearTimeout(id);
  }, [local, onChange]);

  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        className="search-bar__input"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search GIFs (e.g. cat, meme, rain)"
      />

      <button type="submit" disabled={isLoading} className="search-bar__button">
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
};
