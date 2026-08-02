import { useEffect, useState } from "react";
import type {
  Category,
  Property,
  PropertyFilters,
  QueryResult,
} from "./types";

function buildQueryString(filters: PropertyFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function useQuery<T>(url: string | null): QueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const target = url;
    if (!target) return;

    const controller = new AbortController();
    let active = true;

    async function run(route: string) {
      setIsFetching(true);
      try {
        const res = await fetch(route, { signal: controller.signal });
        const json = await res.json();
        if (!active) return;
        if (!res.ok || json.success === false) {
          throw new Error(json.message || `Request failed (${res.status})`);
        }
        setData(json.data as T);
        setError(null);
        setIsError(false);
      } catch (err) {
        if (!active) return;
        if (err instanceof Error && err.name === "AbortError") return;
        setData(null);
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
        setIsError(true);
      } finally {
        if (active) setIsFetching(false);
      }
    }

    run(target);
    return () => {
      active = false;
      controller.abort();
    };
  }, [url, attempt]);

  const isLoading = data === null && !isError;

  return { data, isLoading, isFetching, isError, error, refetch: () => setAttempt((n) => n + 1) };
}

export function useGetPropertiesQuery(
  filters: PropertyFilters = {}
): QueryResult<Property[]> {
  const url = `/api/properties${buildQueryString(filters)}`;
  return useQuery<Property[]>(url);
}

export function useGetCategoriesQuery(): QueryResult<Category[]> {
  return useQuery<Category[]>("/api/categories");
}

export function useGetPropertyQuery(id?: string): QueryResult<Property> {
  const url = id ? `/api/properties/${id}` : null;
  return useQuery<Property>(url);
}
