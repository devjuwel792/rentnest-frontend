"use client";

import Link from "next/link";
import { useGetCategoriesQuery } from "@/lib/api";

const CATEGORY_ICONS: Record<string, string> = {
  Apartment: "🏢",
  Villa: "🏡",
  Studio: "🛋️",
  House: "🏠",
  Duplex: "🏘️",
  Commercial: "🏬",
};

export default function CategoryShowcase() {
  const { data: categories } = useGetCategoriesQuery();

  if (!categories || categories.length === 0) return null;

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
      {categories.map((cat) => {
        const icon = CATEGORY_ICONS[cat.name] || "🏠";
        return (
          <Link
            key={cat.id}
            href={`/properties?categoryId=${cat.id}`}
            className="group flex items-center gap-2 rounded-xl border border-white/20 bg-slate-900/60 px-4 py-2 text-xs font-semibold text-gray-100 shadow-md backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-indigo-400 hover:bg-indigo-600/30 hover:text-white"
          >
            <span className="text-base transition-transform group-hover:scale-110">
              {icon}
            </span>
            <span>{cat.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
