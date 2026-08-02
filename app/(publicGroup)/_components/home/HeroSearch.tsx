"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const HeroSearch = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/properties?search=${encodeURIComponent(value)}` : "/properties");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-gray-200 bg-white p-1.5 shadow-sm"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by location, area or keyword..."
        className="w-full bg-transparent px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
      >
        Search
      </button>
    </form>
  );
};

export default HeroSearch;
