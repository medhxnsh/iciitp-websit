"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import MiniSearch from "minisearch";
import { Link } from "@/i18n/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import type { SearchDoc } from "./page";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Program:      { bg: "#f0f7e6", text: "#3a5214" },
  Event:        { bg: "#fff7ed", text: "#9a3412" },
  Notification: { bg: "#eff6ff", text: "#1e40af" },
  Facility:     { bg: "#faf5ff", text: "#6b21a8" },
  Startup:      { bg: "#f0fdf4", text: "#166534" },
};

interface Props {
  docs: SearchDoc[];
}

export function SearchClient({ docs }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const engine = useMemo(() => {
    const ms = new MiniSearch<SearchDoc>({
      fields: ["title", "body", "category"],
      storeFields: ["title", "body", "category", "href"],
      searchOptions: {
        boost: { title: 3 },
        fuzzy: 0.15,
        prefix: true,
      },
    });
    ms.addAll(docs);
    return ms;
  }, [docs]);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return engine.search(query);
  }, [engine, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      {/* Search input */}
      <div className="relative mb-8">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: "#7a8e6a" }}
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search programs, events, facilities, startups…"
          className="w-full pl-12 pr-12 py-3.5 rounded-xl text-sm outline-none transition-shadow"
          style={{
            border: "1.5px solid #d4e6c4",
            backgroundColor: "white",
            color: "#1c2e06",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px #3a521420")}
          onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
          aria-label="Search the site"
          aria-controls="search-results"
          aria-autocomplete="list"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            style={{ color: "#7a8e6a" }}
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results */}
      <div id="search-results" role="region" aria-live="polite" aria-label="Search results">
        {query.trim().length >= 2 && results.length === 0 && (
          <p className="text-sm text-center py-12" style={{ color: "#7a8e6a" }}>
            No results for <strong style={{ color: "#1c2e06" }}>&ldquo;{query}&rdquo;</strong>.
            <br />
            Try a different term or browse the <Link href="/help" style={{ color: "#3a5214" }} className="underline underline-offset-2">site map</Link>.
          </p>
        )}

        {results.length > 0 && (
          <>
            <p className="text-xs mb-4" style={{ color: "#7a8e6a" }}>
              {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </p>
            <ul className="space-y-2">
              {results.map((r) => {
                const colors = CATEGORY_COLORS[r.category] ?? { bg: "#f5f5f5", text: "#555" };
                return (
                  <li key={r.id}>
                    <Link
                      href={r.href as `/${string}`}
                      className="group flex items-start justify-between gap-4 rounded-xl p-4 bg-white transition-shadow hover:shadow-sm"
                      style={{ border: "1px solid #e8f0e0" }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                            style={{ backgroundColor: colors.bg, color: colors.text }}
                          >
                            {r.category}
                          </span>
                          <span className="text-sm font-semibold" style={{ color: "#1c2e06" }}>
                            {r.title}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed line-clamp-2"
                          style={{ color: "#7a8e6a" }}
                        >
                          {(r.body as string).slice(0, 140)}
                          {(r.body as string).length > 140 ? "…" : ""}
                        </p>
                      </div>
                      <ArrowRight
                        className="w-4 h-4 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all"
                        style={{ color: "#f79420" }}
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {query.trim().length < 2 && (
          <p className="text-sm text-center py-12" style={{ color: "#7a8e6a" }}>
            Start typing to search the site.
          </p>
        )}
      </div>
    </div>
  );
}
