"use client";

import { useState, type ChangeEvent } from "react";

interface Props {
  onSearch: (city: string) => void;
  loading: boolean;
}

export function SearchBar({ onSearch, loading }: Props) {
  const [value, setValue] = useState("");

  function handleSubmit(e: ChangeEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        placeholder="Enter a city (e.g. San Francisco, Tokyo)"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={loading}
        autoFocus
        className="flex-1 h-10 px-4 text-sm rounded-lg border border-stone-300 bg-stone-50 text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-stone-500 focus:bg-white disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="h-10 px-5 text-sm font-medium rounded-lg border border-stone-300 bg-white text-stone-800 transition hover:bg-stone-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {loading ? "Searching…" : "Search"}
      </button>
    </form>
  );
}