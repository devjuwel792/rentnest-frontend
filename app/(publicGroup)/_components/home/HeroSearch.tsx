"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HeroSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(
      value ? `/properties?search=${encodeURIComponent(value)}` : "/properties"
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-2xl border border-white/20 bg-slate-900/75 p-2.5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 transition-all focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-400/40"
    >
      <div className="flex flex-1 items-center gap-3 px-3">
        <span className="text-xl">🔍</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by area, location, or property title..."
          className="w-full bg-transparent py-2 text-sm text-white placeholder:text-gray-300 focus:outline-none sm:text-base"
        />
      </div>
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/30 transition-all hover:opacity-95 hover:shadow-indigo-500/50"
      >
        Search
      </button>
    </form>
  );
};

export default HeroSearch;
