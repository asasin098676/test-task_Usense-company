import { useEffect, useState } from "react";

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
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      style={{ display: "flex", gap: 12, alignItems: "center" }}
    >
      <input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder="Search GIFs (e.g. cat, meme, rain)"
        style={{
          flex: 1,
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.2)",
          fontSize: 16,
        }}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "12px 14px",
          borderRadius: 10,
          border: "1px solid rgba(0,0,0,0.2)",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Searching…" : "Search"}
      </button>
    </form>
  );
};
