import type { FormEvent } from "react";
import "./SearchBar.css";

type Props = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
};

export const SearchBar = ({ value, onChange, onSubmit, isLoading }: Props) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search GIFs (e.g. cat, meme, rain)"
      />
      <button type="submit" disabled={isLoading} className="search-bar__button">
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
};
